"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/guards/supabase/supabase-client";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_driver: boolean | null;
  identity_verified: boolean | null;
  role: "USER" | "ADMIN";
  rating_avg: number | null;
  created_at: string;
};

export default function UsersPage() {
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, phone, is_driver, identity_verified, role, rating_avg, created_at"
      )
      .order("created_at", { ascending: false });

    if (fetchError) setError(fetchError.message);
    else setRows((data as ProfileRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRole = async (row: ProfileRow) => {
    setBusyId(row.id);
    const nextRole = row.role === "ADMIN" ? "USER" : "ADMIN";
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role: nextRole })
      .eq("id", row.id);
    if (updateError) setError(updateError.message);
    else await load();
    setBusyId(null);
  };

  const toggleVerified = async (row: ProfileRow) => {
    setBusyId(row.id);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ identity_verified: !row.identity_verified })
      .eq("id", row.id);
    if (updateError) setError(updateError.message);
    else await load();
    setBusyId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Utilisateurs</h1>
        <p className="text-sm text-darklink">
          Comptes, rôles ADMIN et vérification d&apos;identité
        </p>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rôle</th>
              <th className="px-4 py-3 font-medium">Conducteur</th>
              <th className="px-4 py-3 font-medium">Identité</th>
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
                  Aucun utilisateur
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{row.full_name || "—"}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={row.role === "ADMIN" ? "default" : "secondary"}>
                      {row.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{row.is_driver ? "Oui" : "Non"}</td>
                  <td className="px-4 py-3">
                    {row.identity_verified ? "Vérifié" : "En attente"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => toggleRole(row)}
                      >
                        {row.role === "ADMIN" ? "Retirer ADMIN" : "Passer ADMIN"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === row.id}
                        onClick={() => toggleVerified(row)}
                      >
                        {row.identity_verified ? "Invalider ID" : "Valider ID"}
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
