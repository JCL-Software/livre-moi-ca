-- Photo publique de l'annonce colis (distincte des preuves de prise/remise).

ALTER TABLE public.parcel_listings
  ADD COLUMN IF NOT EXISTS photo_url TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('parcel-listings', 'parcel-listings', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "parcel_listings_photos_public_read" ON storage.objects;
CREATE POLICY "parcel_listings_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'parcel-listings');

DROP POLICY IF EXISTS "parcel_listings_photos_own_insert" ON storage.objects;
CREATE POLICY "parcel_listings_photos_own_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'parcel-listings'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "parcel_listings_photos_own_update" ON storage.objects;
CREATE POLICY "parcel_listings_photos_own_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'parcel-listings'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'parcel-listings'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "parcel_listings_photos_own_delete" ON storage.objects;
CREATE POLICY "parcel_listings_photos_own_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'parcel-listings'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );
