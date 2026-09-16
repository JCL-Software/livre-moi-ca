-- Jumelage d'une proposition : l'expéditeur retient un conducteur.
-- Le colis MATCHED reste visible pour les voyageurs qui ont proposé.

ALTER TABLE public.parcel_listings
  ADD COLUMN IF NOT EXISTS matched_conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS parcel_listings_matched_conversation_idx
  ON public.parcel_listings (matched_conversation_id)
  WHERE matched_conversation_id IS NOT NULL;

DROP POLICY IF EXISTS "parcel_listings_select" ON public.parcel_listings;
CREATE POLICY "parcel_listings_select" ON public.parcel_listings
  FOR SELECT USING (
    status = 'OPEN'
    OR user_id = (SELECT auth.uid())
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.parcel_listing_id = parcel_listings.id
        AND c.initiator_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "notifications_insert_parcel_match" ON public.notifications;
CREATE POLICY "notifications_insert_parcel_match" ON public.notifications
  FOR INSERT WITH CHECK (
    type IN ('PARCEL_OFFER_ACCEPTED', 'PARCEL_OFFER_DECLINED')
    AND user_id <> (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = parcel_listing_id
        AND p.user_id = (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND c.parcel_listing_id = notifications.parcel_listing_id
        AND c.initiator_id = notifications.user_id
    )
  );
