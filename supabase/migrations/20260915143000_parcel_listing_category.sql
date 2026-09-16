DO $$ BEGIN
  CREATE TYPE public.parcel_category AS ENUM (
    'DOCUMENTS',
    'PARCEL',
    'TOOLS',
    'CLOTHING',
    'FOOD',
    'ELECTRONICS',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.parcel_listings
  ADD COLUMN IF NOT EXISTS category public.parcel_category NOT NULL DEFAULT 'PARCEL';
