import Link from "next/link";
import { Clock3, MapPinned, Package, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { SearchTripResult } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("fr-CA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TripCard({ trip }: { trip: SearchTripResult }) {
  return (
    <Link href={`/trajets/${trip.id}`}>
      <Card className="feature-card overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all dark:border-slate-800">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4 text-orange-500" />
              {formatTime(trip.departure_time)}
              <span>· {trip.estimated_duration_min} min · {Number(trip.distance_km)} km</span>
            </div>
            <p className="font-space text-lg font-bold tracking-tight">
              {trip.origin_name.split(",")[0]} → {trip.destination_name.split(",")[0]}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium">{trip.driver_name || "Conducteur"}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {Number(trip.driver_rating).toFixed(1)}
              </span>
              {trip.vehicle_model && (
                <span className="text-muted-foreground">
                  {trip.vehicle_color} {trip.vehicle_model}
                </span>
              )}
            </div>
            {trip.intermediate_stops?.length > 0 && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPinned className="h-3.5 w-3.5" />
                Arrêts : {trip.intermediate_stops.map((stop) => stop.name).join(" · ")}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="text-2xl font-extrabold text-orange-500">
              {Number(trip.price_per_seat).toFixed(0)} $
            </p>
            <p className="text-xs text-muted-foreground">par place</p>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <Users className="h-3 w-3" />
                {trip.available_seats} places
              </Badge>
              {trip.accepts_parcels && (
                <Badge variant="outline">
                  <Package className="h-3 w-3" />
                  Colis dès {Number(trip.parcel_base_price).toFixed(0)} $
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
