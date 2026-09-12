-- Annonces de colis publiées par les expéditeurs

DO $$ BEGIN
  CREATE TYPE public.parcel_listing_status AS ENUM (
    'OPEN', 'MATCHED', 'CANCELLED', 'EXPIRED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.parcel_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  origin_name TEXT NOT NULL,
  origin_lat DOUBLE PRECISION NOT NULL,
  origin_lng DOUBLE PRECISION NOT NULL,
  origin_point GEOGRAPHY(Point, 4326) NOT NULL,
  destination_name TEXT NOT NULL,
  dest_lat DOUBLE PRECISION NOT NULL,
  dest_lng DOUBLE PRECISION NOT NULL,
  destination_point GEOGRAPHY(Point, 4326) NOT NULL,
  parcel_size public.parcel_size NOT NULL,
  weight_kg NUMERIC(5, 2) NOT NULL,
  is_fragile BOOLEAN NOT NULL DEFAULT FALSE,
  estimated_price NUMERIC(8, 2),
  distance_km NUMERIC(6, 2),
  desired_date DATE,
  recipient_name TEXT,
  recipient_phone TEXT,
  status public.parcel_listing_status NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS parcel_listings_user_idx
  ON public.parcel_listings (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS parcel_listings_open_idx
  ON public.parcel_listings (status, desired_date)
  WHERE status = 'OPEN';

ALTER TABLE public.parcel_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "parcel_listings_select" ON public.parcel_listings;
CREATE POLICY "parcel_listings_select" ON public.parcel_listings
  FOR SELECT USING (
    status = 'OPEN'
    OR user_id = (SELECT auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "parcel_listings_insert_own" ON public.parcel_listings;
CREATE POLICY "parcel_listings_insert_own" ON public.parcel_listings
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "parcel_listings_update_own" ON public.parcel_listings;
CREATE POLICY "parcel_listings_update_own" ON public.parcel_listings
  FOR UPDATE USING (
    user_id = (SELECT auth.uid())
    OR public.is_admin()
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR public.is_admin()
  );

GRANT SELECT ON public.parcel_listings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.parcel_listings TO authenticated;
