import { MapPinned, Package } from "lucide-react";
import { UberAvatar, UberCardLink, UberTag } from "@/components/baseweb/uber-ui";
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
    <UberCardLink href={`/trajets/${trip.id}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="m-0 text-sm text-[#545454]">
            {formatTime(trip.departure_time)}
            <span>
              {" "}
              · {trip.estimated_duration_min} min · {Number(trip.distance_km)} km
            </span>
          </p>
          <p className="uber-card-title">
            {trip.origin_name.split(",")[0]} → {trip.destination_name.split(",")[0]}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <UberAvatar
              name={trip.driver_name || "Conducteur"}
              src={trip.driver_avatar}
              size="32px"
              verified={trip.driver_identity_verified}
            />
            <span className="font-medium text-black">{trip.driver_name || "Conducteur"}</span>
            <span className="text-[#545454]">{Number(trip.driver_rating).toFixed(1)}</span>
            {trip.vehicle_model ? (
              <span className="text-[#545454]">
                {trip.vehicle_color} {trip.vehicle_model}
              </span>
            ) : null}
          </div>
          {trip.intermediate_stops?.length > 0 ? (
            <p className="m-0 flex items-center gap-1 text-xs text-[#545454]">
              <MapPinned size={14} aria-hidden />
              Arrêts : {trip.intermediate_stops.map((stop) => stop.name).join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <p className="uber-price">
            {Number(trip.price_per_seat).toFixed(0)} $
          </p>
          <p className="m-0 text-xs text-[#545454]">par place</p>
          <div className="flex flex-wrap gap-2">
            <UberTag>
              {trip.available_seats} place{trip.available_seats > 1 ? "s" : ""}
            </UberTag>
            {trip.accepts_parcels ? (
              <UberTag tone="muted">
                <span className="inline-flex items-center gap-1">
                  <Package size={12} aria-hidden />
                  Colis dès {Number(trip.parcel_base_price).toFixed(0)} $
                </span>
              </UberTag>
            ) : null}
          </div>
        </div>
      </div>
    </UberCardLink>
  );
}
