"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/app/guards/supabase/supabase-client";
import useAuth from "@/app/guards/auth-guard/UseAuth";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  trip_id: string | null;
  booking_id: string | null;
  user: { full_name: string; email: string } | null;
};

type TicketMessage = {
  id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  sender_id: string;
};

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!ticketId) return;
    setLoading(true);
    const [ticketRes, messagesRes] = await Promise.all([
      supabase
        .from("support_tickets")
        .select(
          "id, subject, category, status, priority, trip_id, booking_id, user:profiles!support_tickets_user_id_fkey(full_name, email)"
        )
        .eq("id", ticketId)
        .maybeSingle(),
      supabase
        .from("ticket_messages")
        .select("id, message, is_admin, created_at, sender_id")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true }),
    ]);

    if (ticketRes.error) setError(ticketRes.error.message);
    else if (messagesRes.error) setError(messagesRes.error.message);
    else {
      const raw = ticketRes.data as any;
      setTicket(
        raw
          ? {
              ...raw,
              user: Array.isArray(raw.user) ? raw.user[0] ?? null : raw.user,
            }
          : null
      );
      setMessages((messagesRes.data as TicketMessage[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [ticketId]);

  const onReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id || !reply.trim() || !ticketId) return;
    setSending(true);
    setError(null);
    const { error: insertError } = await supabase.from("ticket_messages").insert({
      ticket_id: ticketId,
      sender_id: user.id,
      is_admin: true,
      message: reply.trim(),
    });
    if (insertError) setError(insertError.message);
    else {
      setReply("");
      await load();
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tickets" className="text-sm text-primary">
          ← Retour aux tickets
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Fiche litige</h1>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}
      {loading ? <p className="text-sm text-darklink">Chargement…</p> : null}

      {ticket ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <Card className="space-y-3 p-5 xl:col-span-1">
            <h2 className="font-medium">{ticket.subject}</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{ticket.status}</Badge>
              <Badge variant="secondary">{ticket.priority}</Badge>
            </div>
            <p className="text-sm text-darklink">Catégorie : {ticket.category}</p>
            <p className="text-sm">
              {ticket.user?.full_name}
              <br />
              <span className="text-darklink">{ticket.user?.email}</span>
            </p>
            {ticket.trip_id ? (
              <Link className="text-sm text-primary" href={`/trips/${ticket.trip_id}`}>
                Voir le trajet lié
              </Link>
            ) : null}
          </Card>

          <Card className="space-y-4 p-5 xl:col-span-2">
            <h3 className="font-medium">Conversation support</h3>
            <div className="max-h-[420px] space-y-3 overflow-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-darklink">Aucun message pour l&apos;instant.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg border p-3 text-sm ${
                      msg.is_admin ? "border-primary/30 bg-primary/5" : "bg-muted/30"
                    }`}
                  >
                    <div className="mb-1 text-xs text-darklink">
                      {msg.is_admin ? "Admin" : "Utilisateur"} ·{" "}
                      {new Date(msg.created_at).toLocaleString("fr-CA")}
                    </div>
                    <p>{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            <form className="space-y-3" onSubmit={onReply}>
              <Textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Répondre au ticket…"
                rows={4}
                required
              />
              <Button type="submit" disabled={sending}>
                {sending ? "Envoi…" : "Envoyer la réponse"}
              </Button>
            </form>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
