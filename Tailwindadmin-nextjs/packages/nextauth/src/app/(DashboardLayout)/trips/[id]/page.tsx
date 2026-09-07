"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/app/guards/supabase/supabase-client";

type TripDetail = {
  id: string;
  origin_name: string;
  destination_name: string;
  departure_time: string;
  status: string;
  distance_km: number;
  route_polyline: string | null;
};

type LocationPoint = {
  id: number;
  lat: number;
  lng: number;
  recorded_at: string;
  heading: number | null;
};

export default function TripDetailPage() {
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [points, setPoints] = useState<LocationPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;
    const load = async () => {
      setLoading(true);
      const [tripRes, locRes] = await Promise.all([
        supabase
          .from("trips")
          .select(
            "id, origin_name, destination_name, departure_time, status, distance_km, route_polyline"
          )
          .eq("id", tripId)
          .maybeSingle(),
        supabase
          .from("trip_locations")
          .select("id, lat, lng, recorded_at, heading")
          .eq("trip_id", tripId)
          .order("recorded_at", { ascending: true })
          .limit(500),
      ]);

      if (tripRes.error) setError(tripRes.error.message);
      else if (locRes.error) setError(locRes.error.message);
      else {
        setTrip(tripRes.data as TripDetail | null);
        setPoints((locRes.data as LocationPoint[]) ?? []);
      }
      setLoading(false);
    };
    load();
  }, [tripId]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/trips" className="text-sm text-primary">
          ← Retour aux trajets
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Détail trajet</h1>
      </div>

      {error ? <Card className="p-4 text-sm text-error">{error}</Card> : null}
      {loading ? <p className="text-sm text-darklink">Chargement…</p> : null}

      {trip ? (
        <Card className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium">
              {trip.origin_name} → {trip.destination_name}
            </h2>
            <Badge variant="outline">{trip.status}</Badge>
          </div>
          <p className="text-sm text-darklink">
            Départ {new Date(trip.departure_time).toLocaleString("fr-CA")} ·{" "}
            {trip.distance_km} km
          </p>
        </Card>
      ) : null}

      <Card className="p-5">
        <h3 className="mb-3 font-medium">Historique GPS ({points.length} points)</h3>
        {points.length === 0 ? (
          <p className="text-sm text-darklink">
            Aucun point enregistré. Les points arriveront quand l&apos;app Expo
            publiera dans <code>trip_locations</code> (le live reste en Broadcast).
          </p>
        ) : (
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-3">Heure</th>
                  <th className="py-2 pr-3">Lat</th>
                  <th className="py-2 pr-3">Lng</th>
                  <th className="py-2">Cap</th>
                </tr>
              </thead>
              <tbody>
                {points.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">
                      {new Date(p.recorded_at).toLocaleString("fr-CA")}
                    </td>
                    <td className="py-2 pr-3">{p.lat.toFixed(5)}</td>
                    <td className="py-2 pr-3">{p.lng.toFixed(5)}</td>
                    <td className="py-2">{p.heading ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
