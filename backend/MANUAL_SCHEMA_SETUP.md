# Manual Schema Setup (Using Existing Supabase)

This project connects to an existing Supabase database. Do NOT overwrite existing tables. Use the following as guidance if you need to align a fresh project, or to add policies. Otherwise, you can skip this file.

## Enable Extensions (if starting new)
```sql
-- Enable UUID helpers
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
```

## Row Level Security (examples to adapt)
Enable RLS and add minimal policies. Adjust to your roles and ownership rules.

```sql
-- profiles
alter table public.profiles enable row level security;

create policy profiles_read_self_or_admin on public.profiles
for select using (
  auth.role() = 'service_role' or auth.uid() = user_id
);

-- bins (uses owner_user_id)
alter table public.bins enable row level security;

create policy bins_read_owner_or_admin on public.bins
for select using (
  auth.role() = 'service_role' or auth.uid() = owner_user_id
);

create policy bins_insert_admin_only on public.bins
for insert with check (
  auth.role() = 'service_role'
);

-- bin_events
alter table public.bin_events enable row level security;

create policy bin_events_device_insert on public.bin_events
for insert with check (
  auth.role() = 'service_role'
);

create policy bin_events_read_owner_or_admin on public.bin_events
for select using (
  auth.role() = 'service_role'
);
```

Notes:
- Replace conditions to match your real roles/ownership rules.
- Service role bypasses RLS for our backend server.
- If Auth triggers mirror `auth.users` to `profiles`, keep your `profiles` columns in sync with triggers.

## Device Keys (table example)
```sql
create table if not exists public.device_keys (
  id uuid primary key default gen_random_uuid(),
  bin_id uuid not null references public.bins(id) on delete cascade,
  api_key uuid not null unique,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table public.device_keys enable row level security;
create policy device_keys_admin_only on public.device_keys for all using (auth.role() = 'service_role');
```

## Audit Logs (optional)
```sql
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  action text not null,
  entity text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
create policy audit_logs_admin_only on public.audit_logs for all using (auth.role() = 'service_role');
```