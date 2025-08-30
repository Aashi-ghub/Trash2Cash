# 🗄️ Manual Database Schema Setup

Since Supabase doesn't allow direct SQL execution through the client, you need to create the database schema manually in the Supabase SQL Editor.

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

## Step 2: Execute the Schema

Copy and paste the entire contents of `src/database/schema.sql` into the SQL Editor and click "Run".

## Step 3: Verify Setup

After running the schema, run this command to verify everything is set up correctly:

```bash
npm run setup-db
```

## Alternative: Quick Schema Copy

Here's the complete schema to copy:

```sql
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
    email VARCHAR(255) UNIQUE NOT NULL,
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
```

## Step 4: Test the Setup

After running the schema, test your setup:

```bash
# Verify database connection
npm run setup-db

# Start the server
npm run dev

# Test the API
node test-api.js
```

## Troubleshooting

If you encounter any errors:

1. **Check Supabase Project Status**: Ensure your project is active
2. **Verify Permissions**: Make sure you have admin access to the project
3. **Check SQL Syntax**: The schema should run without errors
4. **Verify Environment Variables**: Ensure your `.env` file has correct Supabase credentials

## Next Steps

Once the schema is created successfully:

1. Run `npm run setup-db` to verify the setup
2. Run `npm run seed-data` to populate test data
3. Start testing with `node test-api.js` or Postman 