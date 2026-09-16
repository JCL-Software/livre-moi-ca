-- Détails de remise privés (appartement, adresse complète, destinataire).
-- Visibles uniquement par l'expéditeur, l'admin et le conducteur retenu.

CREATE TABLE IF NOT EXISTS public.parcel_delivery_details (
  listing_id UUID PRIMARY KEY REFERENCES public.parcel_listings(id) ON DELETE CASCADE,
  origin_unit TEXT,
  dest_unit TEXT,
  dest_address TEXT,
  recipient_first_name TEXT,
  recipient_last_name TEXT,
  recipient_phone TEXT,
  meeting_point TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.parcel_delivery_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "parcel_delivery_details_select" ON public.parcel_delivery_details;
CREATE POLICY "parcel_delivery_details_select" ON public.parcel_delivery_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = listing_id
        AND p.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      JOIN public.conversations c ON c.id = p.matched_conversation_id
      WHERE p.id = listing_id
        AND c.initiator_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "parcel_delivery_details_insert_own" ON public.parcel_delivery_details;
CREATE POLICY "parcel_delivery_details_insert_own" ON public.parcel_delivery_details
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = listing_id
        AND p.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "parcel_delivery_details_update_own" ON public.parcel_delivery_details;
CREATE POLICY "parcel_delivery_details_update_own" ON public.parcel_delivery_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = listing_id
        AND p.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = listing_id
        AND p.user_id = (SELECT auth.uid())
    )
    OR public.is_admin()
  );

GRANT SELECT, INSERT, UPDATE ON public.parcel_delivery_details TO authenticated;

INSERT INTO public.parcel_delivery_details (
  listing_id,
  recipient_first_name,
  recipient_phone
)
SELECT
  id,
  NULLIF(BTRIM(recipient_name), ''),
  NULLIF(BTRIM(recipient_phone), '')
FROM public.parcel_listings
WHERE COALESCE(BTRIM(recipient_name), '') <> ''
   OR COALESCE(BTRIM(recipient_phone), '') <> ''
ON CONFLICT (listing_id) DO NOTHING;

UPDATE public.parcel_listings
SET recipient_name = NULL,
    recipient_phone = NULL
WHERE recipient_name IS NOT NULL
   OR recipient_phone IS NOT NULL;
