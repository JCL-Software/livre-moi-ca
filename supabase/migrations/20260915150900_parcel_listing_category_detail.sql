ALTER TABLE public.parcel_listings
  ADD COLUMN IF NOT EXISTS category_detail TEXT;
