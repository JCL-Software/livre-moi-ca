"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/app/guards/supabase/supabase-client";

type TripRow = {
  id: string;
  origin_name: string;
  destination_name: string;
  departure_time: string;
  status: string;
  available_seats: number;
  accepts_parcels: boolean;
  driver: { full_name: string; email: string } | null;
};

export default function TripsPage() {
  const [rows, setRows] = useState<TripRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("trips")
        .select(
          "id, origin_name, destination_name, departure_time, status, available_seats, accepts_parcels, driver:profiles!trips_driver_id_fkey(full_name, email)"
        )
        .order("departure_time", { ascending: false })
        .limit(100);

      if (fetchError) setError(fetchError.message);
      else {
        const normalized = (data ?? []).map((row: any) => ({
          ...row,
          driver: Array.isArray(row.driver) ? row.driver[0] ?? null : row.driver,
        }));
        setRows(normalized as TripRow[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Trajets</h1>
        <p className="text-sm text-darklink">
          Covoiturage et cotransportage publiés
        </p>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Trajet</th>
              <th className="px-4 py-3 font-medium">Conducteur</th>
              <th className="px-4 py-3 font-medium">Départ</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Places</th>
              <th className="px-4 py-3 font-medium"></th>
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
                  Aucun trajet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    {row.origin_name} → {row.destination_name}
                    {row.accepts_parcels ? (
                      <Badge className="ml-2" variant="secondary">
                        Colis
                      </Badge>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {row.driver?.full_name || "—"}
                    <div className="text-xs text-darklink">{row.driver?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(row.departure_time).toLocaleString("fr-CA")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{row.available_seats}</td>
                  <td className="px-4 py-3">
                    <Link className="text-primary text-sm font-medium" href={`/trips/${row.id}`}>
                      Détail / GPS
                    </Link>
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
