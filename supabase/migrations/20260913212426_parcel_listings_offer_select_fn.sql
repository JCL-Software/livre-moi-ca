-- Évite une récursion RLS entre parcel_listings et conversations.

CREATE OR REPLACE FUNCTION public.is_parcel_offer_initiator(p_listing_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.parcel_listing_id = p_listing_id
      AND c.initiator_id = (SELECT auth.uid())
  );
$$;

REVOKE ALL ON FUNCTION public.is_parcel_offer_initiator(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_parcel_offer_initiator(UUID) TO anon, authenticated;

DROP POLICY IF EXISTS "parcel_listings_select" ON public.parcel_listings;
CREATE POLICY "parcel_listings_select" ON public.parcel_listings
  FOR SELECT USING (
    status = 'OPEN'
    OR user_id = (SELECT auth.uid())
    OR public.is_admin()
    OR public.is_parcel_offer_initiator(id)
  );
