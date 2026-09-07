"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/guards/supabase/supabase-client";

type TicketRow = {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  user: { full_name: string; email: string } | null;
};

export default function TicketsPage() {
  const [rows, setRows] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("support_tickets")
      .select(
        "id, subject, category, status, priority, created_at, user:profiles!support_tickets_user_id_fkey(full_name, email)"
      )
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else {
      const normalized = (data ?? []).map((row: any) => ({
        ...row,
        user: Array.isArray(row.user) ? row.user[0] ?? null : row.user,
      }));
      setRows(normalized as TicketRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    const { error: updateError } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", id);
    if (updateError) setError(updateError.message);
    else await load();
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tickets / Litiges</h1>
        <p className="text-sm text-darklink">Support utilisateurs et conducteurs</p>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Sujet</th>
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Priorité</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-darklink" colSpan={6}>
                  Chargement…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-darklink" colSpan={6}>
                  Aucun ticket pour le moment
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/tickets/${row.id}`} className="font-medium text-primary">
                      {row.subject}
                    </Link>
                    <div className="text-xs text-darklink">
                      {new Date(row.created_at).toLocaleString("fr-CA")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {row.user?.full_name || "—"}
                    <div className="text-xs text-darklink">{row.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">{row.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{row.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => setStatus(row.id, "IN_PROGRESS")}
                      >
                        En cours
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => setStatus(row.id, "RESOLVED")}
                      >
                        Résolu
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
