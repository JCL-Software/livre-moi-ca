import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/bookings/booking-form";
import { TripMapDynamic } from "@/components/maps/trip-map-dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IntermediateStop } from "@/lib/types";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: trip } = await supabase
    .from("trips")
    .select("*, profiles(*)")
    .eq("id", id)
    .single();

  if (!trip) notFound();

  const driver = Array.isArray(trip.profiles) ? trip.profiles[0] : trip.profiles;
  const stops = (trip.intermediate_stops ?? []) as IntermediateStop[];

  let route: [number, number][] | undefined;
  if (trip.route_polyline) {
    try {
      const geojson = JSON.parse(trip.route_polyline) as {
        coordinates?: [number, number][];
      };
      route = geojson.coordinates?.map(([lng, lat]) => [lat, lng]);
    } catch {
      route = undefined;
    }
  }

  const origin = {
    lat: Number(trip.origin_lat ?? 48.0974),
    lng: Number(trip.origin_lng ?? -77.7974),
    name: trip.origin_name,
  };
  const destination = {
    lat: Number(trip.dest_lat ?? 45.5017),
    lng: Number(trip.dest_lng ?? -73.5673),
    name: trip.destination_name,
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Trajet</p>
          <p className="text-sm text-muted-foreground">
            {new Date(trip.departure_time).toLocaleString("fr-CA", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {trip.origin_name.split(",")[0]} → {trip.destination_name.split(",")[0]}
          </h1>
          <p className="text-muted-foreground">
            {Number(trip.distance_km)} km · {trip.estimated_duration_min} min
          </p>
        </div>
        <div className="h-[360px] overflow-hidden rounded-2xl border shadow-sm">
          <TripMapDynamic
            origin={origin}
            destination={destination}
            route={route}
            stops={stops}
          />
        </div>
        {stops.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Arrêts : {stops.map((stop) => stop.name).join(" · ")}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Card className="border-border/80 shadow-md shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Conducteur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{driver?.full_name || "Conducteur Livre-moi.ca"}</p>
            <p className="flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {Number(driver?.rating_avg ?? 5).toFixed(1)} ({driver?.rating_count ?? 0} avis)
            </p>
            {driver?.vehicle_model && (
              <p>
                {driver.vehicle_color} {driver.vehicle_model}
                {driver.vehicle_plate ? ` · ${driver.vehicle_plate}` : ""}
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">{trip.available_seats} places</Badge>
              {trip.accepts_parcels && <Badge variant="outline">Colis acceptés</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-md shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Réserver</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingForm
              tripId={trip.id}
              availableSeats={trip.available_seats}
              pricePerSeat={Number(trip.price_per_seat)}
              acceptsParcels={trip.accepts_parcels}
              parcelBasePrice={Number(trip.parcel_base_price)}
              loggedIn={Boolean(user)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
