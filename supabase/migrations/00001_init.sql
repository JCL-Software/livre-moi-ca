-- NordTrajet — schéma initial (Supabase + PostGIS)
-- Exécuter dans le SQL Editor ou via `supabase db push`

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE SCHEMA IF NOT EXISTS private;

DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_type AS ENUM ('PASSENGER', 'PARCEL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.parcel_size AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.trip_status AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM (
    'PENDING', 'CONFIRMED', 'PICKED_UP', 'DELIVERED', 'CANCELLED', 'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_driver BOOLEAN DEFAULT FALSE,
  vehicle_model TEXT,
  vehicle_plate TEXT,
  vehicle_color TEXT,
  bio TEXT,
  rating_avg NUMERIC(3, 2) DEFAULT 5.00,
  rating_count INT DEFAULT 0,
  identity_verified BOOLEAN DEFAULT FALSE,
  role public.user_role DEFAULT 'USER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origin_name TEXT NOT NULL,
  origin_lat DOUBLE PRECISION NOT NULL,
  origin_lng DOUBLE PRECISION NOT NULL,
  origin_point GEOGRAPHY(Point, 4326) NOT NULL,
  destination_name TEXT NOT NULL,
  dest_lat DOUBLE PRECISION NOT NULL,
  dest_lng DOUBLE PRECISION NOT NULL,
  destination_point GEOGRAPHY(Point, 4326) NOT NULL,
  route_polyline TEXT,
  distance_km NUMERIC(6, 2) NOT NULL,
  estimated_duration_min INT NOT NULL,
  departure_time TIMESTAMPTZ NOT NULL,
  arrival_time_est TIMESTAMPTZ,
  total_seats INT DEFAULT 0,
  available_seats INT DEFAULT 0,
  price_per_seat NUMERIC(8, 2) DEFAULT 0.00,
  accepts_parcels BOOLEAN DEFAULT TRUE,
  max_parcel_size public.parcel_size DEFAULT 'MEDIUM',
  parcel_base_price NUMERIC(8, 2) DEFAULT 15.00,
  parcel_price_per_kg NUMERIC(6, 2) DEFAULT 0.00,
  intermediate_stops JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{"smoking": false, "pets": false, "luggage": "MEDIUM"}'::jsonb,
  status public.trip_status DEFAULT 'SCHEDULED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT seats_ok CHECK (available_seats >= 0 AND available_seats <= total_seats)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_type public.booking_type NOT NULL,
  status public.booking_status DEFAULT 'PENDING',
  seats_booked INT DEFAULT 1,
  parcel_title TEXT,
  parcel_description TEXT,
  parcel_size public.parcel_size,
  parcel_weight_kg NUMERIC(5, 2),
  parcel_photo_url TEXT,
  recipient_name TEXT,
  recipient_phone TEXT,
  delivery_otp_hash TEXT,
  is_otp_verified BOOLEAN DEFAULT FALSE,
  pickup_proof_url TEXT,
  delivery_proof_url TEXT,
  total_price NUMERIC(8, 2) NOT NULL,
  payment_status TEXT DEFAULT 'PAYMENT_PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booking_secrets (
  booking_id UUID PRIMARY KEY REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  otp_code VARCHAR(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS public.geo_cache (
  query_text TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  cached_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS trips_origin_idx ON public.trips USING GIST (origin_point);
CREATE INDEX IF NOT EXISTS trips_destination_idx ON public.trips USING GIST (destination_point);
CREATE INDEX IF NOT EXISTS trips_departure_time_idx ON public.trips (departure_time);
CREATE INDEX IF NOT EXISTS trips_status_idx ON public.trips (status);
CREATE INDEX IF NOT EXISTS bookings_trip_idx ON public.bookings (trip_id);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS geo_cache_display_idx ON public.geo_cache (display_name);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Matching spatial : origine/destination ou arrêts intermédiaires (corridor Abitibi)
CREATE OR REPLACE FUNCTION public.search_trips(
  origin_lat DOUBLE PRECISION,
  origin_lng DOUBLE PRECISION,
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  travel_date DATE,
  booking_kind public.booking_type DEFAULT 'PASSENGER',
  origin_radius_km DOUBLE PRECISION DEFAULT 25,
  dest_radius_km DOUBLE PRECISION DEFAULT 30,
  parcel_sz public.parcel_size DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  driver_id UUID,
  driver_name TEXT,
  driver_avatar TEXT,
  driver_rating NUMERIC,
  origin_name TEXT,
  destination_name TEXT,
  departure_time TIMESTAMPTZ,
  arrival_time_est TIMESTAMPTZ,
  distance_km NUMERIC,
  estimated_duration_min INT,
  available_seats INT,
  price_per_seat NUMERIC,
  accepts_parcels BOOLEAN,
  max_parcel_size public.parcel_size,
  parcel_base_price NUMERIC,
  origin_distance_km NUMERIC,
  dest_distance_km NUMERIC,
  intermediate_stops JSONB,
  preferences JSONB,
  vehicle_model TEXT,
  vehicle_color TEXT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
  WITH params AS (
    SELECT
      ST_SetSRID(ST_MakePoint(origin_lng, origin_lat), 4326)::geography AS origin_geo,
      ST_SetSRID(ST_MakePoint(dest_lng, dest_lat), 4326)::geography AS dest_geo
  )
  SELECT
    t.id,
    t.driver_id,
    p.full_name AS driver_name,
    p.avatar_url AS driver_avatar,
    p.rating_avg AS driver_rating,
    t.origin_name,
    t.destination_name,
    t.departure_time,
    t.arrival_time_est,
    t.distance_km,
    t.estimated_duration_min,
    t.available_seats,
    t.price_per_seat,
    t.accepts_parcels,
    t.max_parcel_size,
    t.parcel_base_price,
    ROUND((ST_Distance(t.origin_point, params.origin_geo) / 1000)::numeric, 2) AS origin_distance_km,
    ROUND((ST_Distance(t.destination_point, params.dest_geo) / 1000)::numeric, 2) AS dest_distance_km,
    t.intermediate_stops,
    t.preferences,
    p.vehicle_model,
    p.vehicle_color
  FROM public.trips t
  JOIN public.profiles p ON p.id = t.driver_id
  CROSS JOIN params
  WHERE t.status = 'SCHEDULED'
    AND t.departure_time >= travel_date::timestamptz
    AND t.departure_time < (travel_date + INTERVAL '1 day')::timestamptz
    AND (
      (
        ST_DWithin(t.origin_point, params.origin_geo, origin_radius_km * 1000)
        AND ST_DWithin(t.destination_point, params.dest_geo, dest_radius_km * 1000)
      )
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(t.intermediate_stops, '[]'::jsonb)) WITH ORDINALITY AS s(stop, ord)
        WHERE ST_DWithin(
          ST_SetSRID(ST_MakePoint((s.stop->>'lng')::float, (s.stop->>'lat')::float), 4326)::geography,
          params.origin_geo,
          origin_radius_km * 1000
        )
      )
      OR EXISTS (
        SELECT 1
        FROM jsonb_array_elements(COALESCE(t.intermediate_stops, '[]'::jsonb)) WITH ORDINALITY AS s(stop, ord)
        WHERE ST_DWithin(
          ST_SetSRID(ST_MakePoint((s.stop->>'lng')::float, (s.stop->>'lat')::float), 4326)::geography,
          params.dest_geo,
          dest_radius_km * 1000
        )
      )
    )
    AND (
      (booking_kind = 'PASSENGER' AND t.available_seats > 0)
      OR (
        booking_kind = 'PARCEL'
        AND t.accepts_parcels = TRUE
        AND (
          parcel_sz IS NULL
          OR array_position(enum_range(NULL::public.parcel_size), t.max_parcel_size)
             >= array_position(enum_range(NULL::public.parcel_size), parcel_sz)
        )
      )
    )
  ORDER BY t.departure_time ASC;
$$;

CREATE OR REPLACE FUNCTION private.verify_delivery_otp(p_booking_id UUID, p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash TEXT;
  v_driver UUID;
  v_ok BOOLEAN;
BEGIN
  SELECT b.delivery_otp_hash, t.driver_id
    INTO v_hash, v_driver
  FROM public.bookings b
  JOIN public.trips t ON t.id = b.trip_id
  WHERE b.id = p_booking_id;

  IF v_driver IS NULL OR v_driver <> auth.uid() THEN
    RAISE EXCEPTION 'Non autorisé';
  END IF;

  IF v_hash IS NULL THEN
    RETURN FALSE;
  END IF;

  v_ok := v_hash = encode(digest(p_code, 'sha256'), 'hex');

  IF v_ok THEN
    UPDATE public.bookings
    SET
      is_otp_verified = TRUE,
      status = 'DELIVERED',
      payment_status = 'PAID_TO_DRIVER'
    WHERE id = p_booking_id;
  END IF;

  RETURN v_ok;
END;
$$;

REVOKE ALL ON FUNCTION private.verify_delivery_otp(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.verify_delivery_otp(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.verify_delivery_otp(p_booking_id UUID, p_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT private.verify_delivery_otp(p_booking_id, p_code);
$$;

REVOKE ALL ON FUNCTION public.verify_delivery_otp(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_delivery_otp(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_trips(
  DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION, DOUBLE PRECISION,
  DATE, public.booking_type, DOUBLE PRECISION, DOUBLE PRECISION, public.parcel_size
) TO anon, authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geo_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "trips_select_public" ON public.trips;
CREATE POLICY "trips_select_public" ON public.trips
  FOR SELECT USING (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED') OR driver_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "trips_insert_own" ON public.trips;
CREATE POLICY "trips_insert_own" ON public.trips
  FOR INSERT WITH CHECK (driver_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "trips_update_own" ON public.trips;
CREATE POLICY "trips_update_own" ON public.trips
  FOR UPDATE USING (driver_id = (SELECT auth.uid()))
  WITH CHECK (driver_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "trips_delete_own" ON public.trips;
CREATE POLICY "trips_delete_own" ON public.trips
  FOR DELETE USING (driver_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "bookings_select" ON public.bookings;
CREATE POLICY "bookings_select" ON public.bookings
  FOR SELECT USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.driver_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own" ON public.bookings
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "bookings_update_parties" ON public.bookings;
CREATE POLICY "bookings_update_parties" ON public.bookings
  FOR UPDATE USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.trips t
      WHERE t.id = trip_id AND t.driver_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "secrets_select_sender" ON public.booking_secrets;
CREATE POLICY "secrets_select_sender" ON public.booking_secrets
  FOR SELECT USING (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "secrets_insert_sender" ON public.booking_secrets;
CREATE POLICY "secrets_insert_sender" ON public.booking_secrets
  FOR INSERT WITH CHECK (sender_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "reviews_select" ON public.reviews;
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "geo_cache_select" ON public.geo_cache;
CREATE POLICY "geo_cache_select" ON public.geo_cache FOR SELECT USING (true);

DROP POLICY IF EXISTS "geo_cache_insert" ON public.geo_cache;
CREATE POLICY "geo_cache_insert" ON public.geo_cache
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

GRANT SELECT ON public.geo_cache TO anon, authenticated;
GRANT INSERT ON public.geo_cache TO authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.trips TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, INSERT ON public.booking_secrets TO authenticated;
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT INSERT ON public.reviews TO authenticated;

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('parcels', 'parcels', false),
  ('licenses', 'licenses', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_own_write" ON storage.objects;
CREATE POLICY "avatars_own_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "avatars_own_update" ON storage.objects;
CREATE POLICY "avatars_own_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "parcels_party_read" ON storage.objects;
CREATE POLICY "parcels_party_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'parcels' AND (SELECT auth.uid()) IS NOT NULL
  );

DROP POLICY IF EXISTS "parcels_auth_write" ON storage.objects;
CREATE POLICY "parcels_auth_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'parcels' AND (SELECT auth.uid()) IS NOT NULL
  );

DROP POLICY IF EXISTS "licenses_own" ON storage.objects;
CREATE POLICY "licenses_own" ON storage.objects
  FOR ALL USING (
    bucket_id = 'licenses' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'licenses' AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );
