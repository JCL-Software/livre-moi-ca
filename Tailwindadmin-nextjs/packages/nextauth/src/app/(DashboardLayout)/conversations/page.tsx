"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { supabase } from "@/app/guards/supabase/supabase-client";

type ConversationRow = {
  id: string;
  trip_id: string;
  booking_id: string | null;
  created_at: string;
  trip: { origin_name: string; destination_name: string } | null;
};

export default function ConversationsPage() {
  const [rows, setRows] = useState<ConversationRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { id: string; content: string; created_at: string; sender_id: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("conversations")
        .select(
          "id, trip_id, booking_id, created_at, trip:trips!conversations_trip_id_fkey(origin_name, destination_name)"
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (fetchError) setError(fetchError.message);
      else {
        const normalized = (data ?? []).map((row: any) => ({
          ...row,
          trip: Array.isArray(row.trip) ? row.trip[0] ?? null : row.trip,
        }));
        setRows(normalized as ConversationRow[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    const loadMessages = async () => {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });
      if (fetchError) setError(fetchError.message);
      else setMessages(data ?? []);
    };
    loadMessages();
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conversations</h1>
        <p className="text-sm text-darklink">
          Historique chat conducteur ↔ client (litiges)
        </p>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 font-medium">Trajet</th>
                <th className="px-4 py-3 font-medium">Créée</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-darklink" colSpan={2}>
                    Chargement…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-darklink" colSpan={2}>
                    Aucune conversation
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`cursor-pointer border-b last:border-0 ${
                      selectedId === row.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedId(row.id)}
                  >
                    <td className="px-4 py-3">
                      {row.trip
                        ? `${row.trip.origin_name} → ${row.trip.destination_name}`
                        : row.trip_id}
                      <div className="mt-1">
                        <Link
                          href={`/trips/${row.trip_id}`}
                          className="text-xs text-primary"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Voir trajet / GPS
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(row.created_at).toLocaleString("fr-CA")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 font-medium">Messages</h3>
          {!selectedId ? (
            <p className="text-sm text-darklink">Sélectionnez une conversation.</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-darklink">Aucun message.</p>
          ) : (
            <div className="max-h-[520px] space-y-3 overflow-auto">
              {messages.map((msg) => (
                <div key={msg.id} className="rounded-lg border p-3 text-sm">
                  <div className="mb-1 text-xs text-darklink">
                    {new Date(msg.created_at).toLocaleString("fr-CA")}
                  </div>
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
