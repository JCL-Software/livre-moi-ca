-- SELECT sur conversations ne doit pas relire la même table via une
-- fonction SECURITY INVOKER (INSERT … RETURNING échoue alors en RLS).

CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations c
    WHERE c.id = p_conversation_id
      AND (
        public.is_admin()
        OR (
          c.trip_id IS NOT NULL
          AND public.is_trip_participant(c.trip_id)
        )
        OR (
          c.parcel_listing_id IS NOT NULL
          AND (
            c.initiator_id = (SELECT auth.uid())
            OR EXISTS (
              SELECT 1
              FROM public.parcel_listings p
              WHERE p.id = c.parcel_listing_id
                AND p.user_id = (SELECT auth.uid())
            )
          )
        )
      )
  );
$$;

REVOKE ALL ON FUNCTION public.is_conversation_participant(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_conversation_participant(UUID) TO authenticated;

DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (
    public.is_admin()
    OR (
      trip_id IS NOT NULL
      AND public.is_trip_participant(trip_id)
    )
    OR (
      parcel_listing_id IS NOT NULL
      AND (
        initiator_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1
          FROM public.parcel_listings p
          WHERE p.id = parcel_listing_id
            AND p.user_id = (SELECT auth.uid())
        )
      )
    )
  );
