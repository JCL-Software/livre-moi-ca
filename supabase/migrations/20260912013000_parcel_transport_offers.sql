-- Option compte « Accepter des colis », tchat lié à une annonce, notifications.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS accepts_parcels BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.conversations
  ALTER COLUMN trip_id DROP NOT NULL;

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS parcel_listing_id UUID REFERENCES public.parcel_listings(id) ON DELETE CASCADE;

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS initiator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_has_context;

ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_has_context CHECK (
    trip_id IS NOT NULL OR parcel_listing_id IS NOT NULL
  );

CREATE UNIQUE INDEX IF NOT EXISTS conversations_parcel_initiator_idx
  ON public.conversations (parcel_listing_id, initiator_id)
  WHERE parcel_listing_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS conversations_parcel_listing_idx
  ON public.conversations (parcel_listing_id)
  WHERE parcel_listing_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
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

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  parcel_listing_id UUID REFERENCES public.parcel_listings(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (
    public.is_admin()
    OR public.is_conversation_participant(id)
  );

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

DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    public.is_admin()
    OR public.is_conversation_participant(conversation_id)
  );

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND public.is_conversation_participant(conversation_id)
  );

DROP POLICY IF EXISTS "messages_update_read" ON public.messages;
CREATE POLICY "messages_update_read" ON public.messages
  FOR UPDATE USING (
    public.is_admin()
    OR public.is_conversation_participant(conversation_id)
  );

DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (user_id = (SELECT auth.uid()) OR public.is_admin());

DROP POLICY IF EXISTS "notifications_insert_parcel_offer" ON public.notifications;
CREATE POLICY "notifications_insert_parcel_offer" ON public.notifications
  FOR INSERT WITH CHECK (
    type = 'PARCEL_TRANSPORT_OFFER'
    AND user_id <> (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.parcel_listings p
      WHERE p.id = parcel_listing_id
        AND p.user_id = notifications.user_id
        AND p.user_id <> (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND c.initiator_id = (SELECT auth.uid())
        AND c.parcel_listing_id = notifications.parcel_listing_id
    )
  );

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (user_id = (SELECT auth.uid()) OR public.is_admin())
  WITH CHECK (user_id = (SELECT auth.uid()) OR public.is_admin());

GRANT EXECUTE ON FUNCTION public.is_conversation_participant(UUID) TO authenticated;

GRANT SELECT, INSERT ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
