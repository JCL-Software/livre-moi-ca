-- Prix proposé / contre-proposé sur une conversation colis.
-- Prix convenu figé sur l'annonce au jumelage (séquestre plus tard).

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS proposed_price NUMERIC(8, 2),
  ADD COLUMN IF NOT EXISTS proposed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS proposed_at TIMESTAMPTZ;

ALTER TABLE public.parcel_listings
  ADD COLUMN IF NOT EXISTS agreed_price NUMERIC(8, 2),
  ADD COLUMN IF NOT EXISTS agreed_driver_payout NUMERIC(8, 2),
  ADD COLUMN IF NOT EXISTS agreed_commission NUMERIC(8, 2);

UPDATE public.conversations c
SET
  proposed_price = p.estimated_price,
  proposed_by = c.initiator_id,
  proposed_at = COALESCE(c.proposed_at, c.created_at, NOW())
FROM public.parcel_listings p
WHERE c.parcel_listing_id = p.id
  AND c.proposed_price IS NULL
  AND p.estimated_price IS NOT NULL;

DROP POLICY IF EXISTS "conversations_update_offer_price" ON public.conversations;
CREATE POLICY "conversations_update_offer_price" ON public.conversations
  FOR UPDATE
  USING (public.is_conversation_participant(id))
  WITH CHECK (public.is_conversation_participant(id));

GRANT UPDATE (proposed_price, proposed_by, proposed_at) ON public.conversations TO authenticated;

DROP POLICY IF EXISTS "notifications_insert_parcel_match" ON public.notifications;
CREATE POLICY "notifications_insert_parcel_match" ON public.notifications
  FOR INSERT WITH CHECK (
    type IN ('PARCEL_OFFER_ACCEPTED', 'PARCEL_OFFER_DECLINED', 'PARCEL_PRICE_COUNTER')
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
