-- ================================================================
-- AutoFleet Pro - Supabase Schema
-- Run in: Supabase Dashboard -> SQL Editor -> New query
-- ================================================================

-- IMPORTANT:
-- This schema uses the canonical identity model:
--   vehicles.id         = internal UUID used by routing/APIs/storage
--   vehicles.business_id = human-readable VH-* reference shown in the UI
--
-- If you already have a legacy deployment where vehicles.id stores VH-* values,
-- migrate that data before switching the app to this schema.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'purchased',
  category TEXT NOT NULL DEFAULT 'car',
  data JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_vehicle_business_id
  ON public.vehicles (business_id);

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vehicles_updated_at ON public.vehicles;
CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Settings
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(user_id, key)
);

-- Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own vehicles" ON public.vehicles;
CREATE POLICY "Users see own vehicles" ON public.vehicles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own vehicles" ON public.vehicles;
CREATE POLICY "Users insert own vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own vehicles" ON public.vehicles;
CREATE POLICY "Users update own vehicles" ON public.vehicles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own vehicles" ON public.vehicles;
CREATE POLICY "Users delete own vehicles" ON public.vehicles
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users see own settings" ON public.settings;
CREATE POLICY "Users see own settings" ON public.settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own settings" ON public.settings;
CREATE POLICY "Users insert own settings" ON public.settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own settings" ON public.settings;
CREATE POLICY "Users update own settings" ON public.settings
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own settings" ON public.settings;
CREATE POLICY "Users delete own settings" ON public.settings
  FOR DELETE USING (auth.uid() = user_id);

-- Private storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Users upload own docs" ON storage.objects;
CREATE POLICY "Users upload own docs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users read own docs" ON storage.objects;
CREATE POLICY "Users read own docs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users delete own docs" ON storage.objects;
CREATE POLICY "Users delete own docs" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Realtime
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.vehicles;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Activity log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID,
  entity_uuid UUID,
  entity_type TEXT NOT NULL DEFAULT 'vehicle',
  vehicle_id UUID,
  action TEXT NOT NULL,
  section TEXT,
  summary TEXT,
  metadata JSONB,
  old_value JSONB,
  new_value JSONB
);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity_uuid
  ON public.activity_log (entity_uuid);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own logs" ON public.activity_log;
CREATE POLICY "Users see own logs" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own logs" ON public.activity_log;
CREATE POLICY "Users insert own logs" ON public.activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions (Stripe)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL DEFAULT 'trial',
  status TEXT NOT NULL DEFAULT 'trialing',
  trial_ends_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days'),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON public.subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON public.subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own subscription" ON public.subscriptions;
CREATE POLICY "Users see own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'trial', 'trialing')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_trial_subscription();
