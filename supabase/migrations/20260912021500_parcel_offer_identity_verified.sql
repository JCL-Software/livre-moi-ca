DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR (
      trip_id IS NOT NULL
      AND public.is_trip_participant(trip_id)
    )
    OR (
      parcel_listing_id IS NOT NULL
      AND initiator_id = (SELECT auth.uid())
      AND EXISTS (
        SELECT 1
        FROM public.profiles pr
        WHERE pr.id = (SELECT auth.uid())
          AND pr.accepts_parcels = TRUE
          AND COALESCE(pr.identity_verified, FALSE) = TRUE
      )
      AND EXISTS (
        SELECT 1
        FROM public.parcel_listings p
        WHERE p.id = parcel_listing_id
          AND p.status = 'OPEN'
          AND p.user_id <> (SELECT auth.uid())
      )
    )
  );
