-- AutoFleet Pro — Schema Migration v6
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Fix vehicles table ─────────────────────────────────────
-- Create fresh if not exists
CREATE TABLE IF NOT EXISTS public.vehicles (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  org_id        UUID,
  category      TEXT,
  make          TEXT,
  model         TEXT,
  year          INT,
  vin           TEXT,
  plate         TEXT,
  color         TEXT,
  fuel_type     TEXT,
  gear_type     TEXT,
  engine_cc     INT,
  power_kw      INT,
  mileage       INT,
  seats         INT,
  doors         INT,
  weight_kg     INT,
  payload_kg    INT,
  status        TEXT DEFAULT 'purchased',
  photo         TEXT,
  notes         TEXT,
  purchase      JSONB,
  transport_in  JSONB,
  storage       JSONB,
  sale          JSONB,
  transport_out JSONB,
  documents     JSONB DEFAULT '[]',
  inspection    JSONB DEFAULT '[]'
);

-- Fix id column default if missing
ALTER TABLE public.vehicles
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Fix user_id if nullable
ALTER TABLE public.vehicles
  ALTER COLUMN user_id SET NOT NULL;

-- ── Fix settings table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.settings (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lang          TEXT DEFAULT 'el',
  org_id        UUID,
  org_data      JSONB,
  anthropic_key TEXT,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Add missing columns if table already exists
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'el';
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS org_id UUID;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS org_data JSONB;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS anthropic_key TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- ── RLS Policies ───────────────────────────────────────────
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own vehicles"    ON public.vehicles;
DROP POLICY IF EXISTS "Users insert own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users update own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users delete own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_select_org"       ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_insert_org"       ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_update_org"       ON public.vehicles;
DROP POLICY IF EXISTS "vehicles_delete_org"       ON public.vehicles;

CREATE POLICY "Users see own vehicles"
  ON public.vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own vehicles"
  ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own vehicles"
  ON public.vehicles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own vehicles"
  ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users manage own settings" ON public.settings;
CREATE POLICY "Users manage own settings"
  ON public.settings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Verify ─────────────────────────────────────────────────
SELECT
  c.column_name,
  c.column_default,
  c.is_nullable
FROM information_schema.columns c
WHERE c.table_name = 'vehicles'
  AND c.column_name IN ('id', 'user_id')
UNION ALL
SELECT
  c.column_name,
  c.column_default,
  c.is_nullable
FROM information_schema.columns c
WHERE c.table_name = 'settings'
  AND c.column_name IN ('id', 'user_id', 'lang');
