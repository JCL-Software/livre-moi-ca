"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/app/guards/supabase/supabase-client";

type BookingRow = {
  id: string;
  booking_type: string;
  status: string;
  total_price: number;
  payment_status: string;
  parcel_title: string | null;
  created_at: string;
  user: { full_name: string; email: string } | null;
  trip: { origin_name: string; destination_name: string } | null;
};

export default function BookingsPage() {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, booking_type, status, total_price, payment_status, parcel_title, created_at, user:profiles!bookings_user_id_fkey(full_name, email), trip:trips!bookings_trip_id_fkey(origin_name, destination_name)"
        )
        .order("created_at", { ascending: false })
        .limit(100);

      if (fetchError) setError(fetchError.message);
      else {
        const normalized = (data ?? []).map((row: any) => ({
          ...row,
          user: Array.isArray(row.user) ? row.user[0] ?? null : row.user,
          trip: Array.isArray(row.trip) ? row.trip[0] ?? null : row.trip,
        }));
        setRows(normalized as BookingRow[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Réservations</h1>
        <p className="text-sm text-darklink">Places et colis</p>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Trajet</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Paiement</th>
              <th className="px-4 py-3 font-medium">Prix</th>
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
                  Aucune réservation
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{row.booking_type}</Badge>
                    {row.parcel_title ? (
                      <div className="mt-1 text-xs text-darklink">{row.parcel_title}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {row.user?.full_name || "—"}
                    <div className="text-xs text-darklink">{row.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {row.trip
                      ? `${row.trip.origin_name} → ${row.trip.destination_name}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{row.payment_status}</td>
                  <td className="px-4 py-3">{Number(row.total_price).toFixed(2)} $</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
