-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('host', 'operator', 'device', 'admin');

-- Create bin status enum
CREATE TYPE bin_status AS ENUM ('active', 'inactive', 'maintenance', 'offline');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'host',
    display_name VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bins table
CREATE TABLE IF NOT EXISTS bins (
    bin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_code VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    location TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status bin_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bin_events table
CREATE TABLE IF NOT EXISTS bin_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_id UUID REFERENCES bins(bin_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    timestamp_utc TIMESTAMPTZ NOT NULL,
    categories JSONB NOT NULL DEFAULT '{}',
    payload_json JSONB NOT NULL DEFAULT '{}',
    hv_count INTEGER DEFAULT 0,
    lv_count INTEGER DEFAULT 0,
    org_count INTEGER DEFAULT 0,
    battery_pct DECIMAL(5,2) CHECK (battery_pct >= 0 AND battery_pct <= 100),
    fill_level_pct DECIMAL(5,2) CHECK (fill_level_pct >= 0 AND fill_level_pct <= 100),
    weight_kg_total DECIMAL(10,3),
    weight_kg_delta DECIMAL(10,3),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_insights table
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL UNIQUE,
    purity_score NUMERIC(3, 2),
    anomaly_detected BOOLEAN DEFAULT FALSE,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES bin_events(id) ON DELETE CASCADE
);

-- Create anomalies table
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_id UUID NOT NULL UNIQUE,
    event_id UUID NOT NULL,
    bin_id UUID NOT NULL,
    anomaly_type VARCHAR(255),
    severity VARCHAR(50),
    details JSONB,
    resolved BOOLEAN DEFAULT FALSE,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (insight_id) REFERENCES ai_insights(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES bin_events(id) ON DELETE CASCADE,
    FOREIGN KEY (bin_id) REFERENCES bins(bin_id) ON DELETE CASCADE
);

-- Create rewards_ledger table
CREATE TABLE IF NOT EXISTS rewards_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    event_id UUID, -- Made nullable to allow redemptions
    points_earned INTEGER NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES bin_events(id) ON DELETE CASCADE
);
--Create device_keys table
CREATE TABLE IF NOT EXISTS public.device_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bin_id UUID NOT NULL REFERENCES public.bins(bin_id) ON DELETE CASCADE,
  api_key UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.device_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY device_keys_admin_only ON public.device_keys FOR ALL USING (auth.role() = 'service_role');

-- Create badges_ledger table
CREATE TABLE IF NOT EXISTS badges_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    description TEXT,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, badge_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bin_events_bin_id ON bin_events(bin_id);
CREATE INDEX IF NOT EXISTS idx_bin_events_timestamp ON bin_events(timestamp_utc);
CREATE INDEX IF NOT EXISTS idx_bin_events_user_id ON bin_events(user_id);
CREATE INDEX IF NOT EXISTS idx_bins_user_id ON bins(user_id);
CREATE INDEX IF NOT EXISTS idx_bins_status ON bins(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bins_updated_at BEFORE UPDATE ON bins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE bin_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update users" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- RLS Policies for bins table
CREATE POLICY "Hosts can view their own bins" ON bins
    FOR SELECT USING (
        user_id IN (
            SELECT user_id FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'host'
        )
    );

CREATE POLICY "Operators can view all bins" ON bins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'operator'
        )
    );

CREATE POLICY "Admins can view all bins" ON bins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert bins" ON bins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update bins" ON bins
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- RLS Policies for bin_events table
CREATE POLICY "Devices can insert events" ON bin_events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'device'
        )
    );

CREATE POLICY "Hosts can view events for their bins" ON bin_events
    FOR SELECT USING (
        bin_id IN (
            SELECT bin_id FROM bins 
            WHERE user_id IN (
                SELECT user_id FROM users 
                WHERE user_id::text = auth.uid()::text 
                AND role = 'host'
            )
        )
    );

CREATE POLICY "Operators can view all events" ON bin_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'operator'
        )
    );

CREATE POLICY "Admins can view all events" ON bin_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create a view for bin summary statistics
CREATE OR REPLACE VIEW bin_summary_stats AS
SELECT 
    b.bin_id,
    b.bin_code,
    b.location,
    b.status,
    u.display_name as owner_name,
    COUNT(be.id) as total_events,
    MAX(be.timestamp_utc) as last_event_time,
    AVG(be.fill_level_pct) as avg_fill_level,
    AVG(be.battery_pct) as avg_battery_level,
    SUM(be.weight_kg_total) as total_weight_processed
FROM bins b
LEFT JOIN users u ON b.user_id = u.user_id
LEFT JOIN bin_events be ON b.bin_id = be.bin_id
GROUP BY b.bin_id, b.bin_code, b.location, b.status, u.display_name;

-- Allow service_role full access (needed for admin scripts / bypassing RLS)
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Also make sure future objects automatically get privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON FUNCTIONS TO service_role;
