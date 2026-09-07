-- Livre-moi.ca — messagerie, tickets support, historique GPS
-- Dépend de 00001_init.sql
-- Exécuter après la migration initiale (SQL Editor ou supabase db push)

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.ticket_status AS ENUM (
    'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_priority AS ENUM (
    'LOW', 'MEDIUM', 'HIGH', 'URGENT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.ticket_category AS ENUM (
    'PARCEL_DAMAGED',
    'DELAY',
    'PAYMENT',
    'NO_SHOW',
    'SAFETY',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Helpers RLS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = (SELECT auth.uid())
      AND p.role = 'ADMIN'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_trip_participant(p_trip_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.trips t
    WHERE t.id = p_trip_id
      AND (
        t.driver_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1
          FROM public.bookings b
          WHERE b.trip_id = t.id
            AND b.user_id = (SELECT auth.uid())
            AND b.status NOT IN ('CANCELLED', 'REJECTED')
        )
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- Conversations & messages (chat trajet / booking)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT conversations_trip_booking_unique UNIQUE (trip_id, booking_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT messages_content_not_empty CHECK (char_length(trim(content)) > 0 OR attachment_url IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS conversations_trip_idx ON public.conversations (trip_id);
CREATE INDEX IF NOT EXISTS conversations_booking_idx ON public.conversations (booking_id);
CREATE INDEX IF NOT EXISTS messages_conversation_created_idx
  ON public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Historique GPS (litiges / admin) — le live reste en Broadcast Realtime
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.trip_locations (
  id BIGSERIAL PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  location GEOGRAPHY(Point, 4326)
    GENERATED ALWAYS AS (
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) STORED,
  heading DOUBLE PRECISION,
  speed_mps DOUBLE PRECISION,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS trip_locations_trip_recorded_idx
  ON public.trip_locations (trip_id, recorded_at);
CREATE INDEX IF NOT EXISTS trip_locations_location_idx
  ON public.trip_locations USING GIST (location);

-- ---------------------------------------------------------------------------
-- Support / litiges
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category public.ticket_category NOT NULL DEFAULT 'OTHER',
  status public.ticket_status NOT NULL DEFAULT 'OPEN',
  priority public.ticket_priority NOT NULL DEFAULT 'MEDIUM',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT ticket_messages_not_empty CHECK (char_length(trim(message)) > 0)
);

CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets (status, priority);
CREATE INDEX IF NOT EXISTS support_tickets_user_idx ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS support_tickets_trip_idx ON public.support_tickets (trip_id);
CREATE INDEX IF NOT EXISTS ticket_messages_ticket_created_idx
  ON public.ticket_messages (ticket_id, created_at);

DROP TRIGGER IF EXISTS support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Storage preuves tickets
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "ticket_attachments_party_read" ON storage.objects;
CREATE POLICY "ticket_attachments_party_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'ticket-attachments'
    AND (SELECT auth.uid()) IS NOT NULL
    AND (
      public.is_admin()
      OR (SELECT auth.uid())::text = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "ticket_attachments_own_write" ON storage.objects;
CREATE POLICY "ticket_attachments_own_write" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ticket-attachments'
    AND (SELECT auth.uid()) IS NOT NULL
    AND (
      public.is_admin()
      OR (SELECT auth.uid())::text = (storage.foldername(name))[1]
    )
  );

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- Conversations : participants du trajet + admin
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select" ON public.conversations
  FOR SELECT USING (
    public.is_admin()
    OR public.is_trip_participant(trip_id)
  );

DROP POLICY IF EXISTS "conversations_insert" ON public.conversations;
CREATE POLICY "conversations_insert" ON public.conversations
  FOR INSERT WITH CHECK (
    public.is_admin()
    OR public.is_trip_participant(trip_id)
  );

-- Messages
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND public.is_trip_participant(c.trip_id)
    )
  );

DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND public.is_trip_participant(c.trip_id)
    )
  );

DROP POLICY IF EXISTS "messages_update_read" ON public.messages;
CREATE POLICY "messages_update_read" ON public.messages
  FOR UPDATE USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_id
        AND public.is_trip_participant(c.trip_id)
    )
  );

-- GPS : conducteur écrit ; participants + admin lisent
DROP POLICY IF EXISTS "trip_locations_select" ON public.trip_locations;
CREATE POLICY "trip_locations_select" ON public.trip_locations
  FOR SELECT USING (
    public.is_admin()
    OR public.is_trip_participant(trip_id)
  );

DROP POLICY IF EXISTS "trip_locations_insert_driver" ON public.trip_locations;
CREATE POLICY "trip_locations_insert_driver" ON public.trip_locations
  FOR INSERT WITH CHECK (
    driver_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.trips t
      WHERE t.id = trip_id
        AND t.driver_id = (SELECT auth.uid())
    )
  );

-- Tickets : auteur + admin
DROP POLICY IF EXISTS "support_tickets_select" ON public.support_tickets;
CREATE POLICY "support_tickets_select" ON public.support_tickets
  FOR SELECT USING (
    public.is_admin()
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "support_tickets_insert" ON public.support_tickets;
CREATE POLICY "support_tickets_insert" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "support_tickets_update" ON public.support_tickets;
CREATE POLICY "support_tickets_update" ON public.support_tickets
  FOR UPDATE USING (
    public.is_admin()
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "ticket_messages_select" ON public.ticket_messages;
CREATE POLICY "ticket_messages_select" ON public.ticket_messages
  FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND t.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "ticket_messages_insert" ON public.ticket_messages;
CREATE POLICY "ticket_messages_insert" ON public.ticket_messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND (
      public.is_admin()
      OR (
        is_admin = FALSE
        AND EXISTS (
          SELECT 1
          FROM public.support_tickets t
          WHERE t.id = ticket_id
            AND t.user_id = (SELECT auth.uid())
        )
      )
    )
  );

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_trip_participant(UUID) TO authenticated;

GRANT SELECT, INSERT ON public.conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT SELECT, INSERT ON public.trip_locations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT ON public.ticket_messages TO authenticated;

-- Realtime : activer la réplication sur messages / ticket_messages dans le dashboard
-- Database → Replication, ou :
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
