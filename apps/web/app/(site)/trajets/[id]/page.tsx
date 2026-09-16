import { notFound } from "next/navigation";
import Link from "next/link";
import { Car, Package, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BookingForm } from "@/components/bookings/booking-form";
import {
  UberAvatar,
  UberCard,
  UberIconTile,
  UberTag,
} from "@/components/baseweb/uber-ui";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { TripMapDynamic } from "@/components/maps/trip-map-dynamic";
import { memberProfileHref } from "@/components/account/account-ui";
import { shortPlace } from "@/lib/account-format";
import type { IntermediateStop, TripPreferences } from "@/lib/types";

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
  const driverNote = (trip.preferences as TripPreferences | null)?.note?.trim();
  const driverName = driver?.full_name || "Conducteur Livre-moi.ca";
  const vehicle = [driver?.vehicle_color, driver?.vehicle_model]
    .filter(Boolean)
    .join(" ");

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

  const when = new Date(trip.departure_time).toLocaleString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SitePage>
      <SiteBackLink href="/recherche?type=PASSENGER">Voir les trajets</SiteBackLink>
      <UberPageIntro
        kicker="Covoiturage régional au Québec et en Ontario"
        title={`${shortPlace(trip.origin_name)} → ${shortPlace(trip.destination_name)}`}
        subtitle={`${when} · ${Number(trip.distance_km)} km · ${trip.estimated_duration_min} min`}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        <div className="space-y-4">
          <UberCard padded={false} className="overflow-hidden">
            <div className="h-[360px]">
              <TripMapDynamic
                origin={origin}
                destination={destination}
                route={route}
                stops={stops}
              />
            </div>
          </UberCard>
          {stops.length > 0 ? (
            <p className="m-0 text-sm text-[#545454]">
              Arrêts : {stops.map((stop) => stop.name).join(" · ")}
            </p>
          ) : null}
          {driverNote ? (
            <p className="m-0 text-sm text-[#545454]">Note : {driverNote}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          <UberCard>
            <p className="uber-home-kicker m-0">Conducteur</p>
            <div className="mt-3 flex items-center gap-3">
              <UberAvatar
                name={driverName}
                src={driver?.avatar_url}
                size="48px"
                verified={Boolean(driver?.identity_verified)}
              />
              <div className="min-w-0">
                {driver?.id ? (
                  <Link
                    href={memberProfileHref(driver.id)}
                    className="font-medium text-black underline-offset-4 hover:underline"
                  >
                    {driverName}
                  </Link>
                ) : (
                  <p className="m-0 font-medium text-black">{driverName}</p>
                )}
                <p className="mt-0.5 mb-0 flex items-center gap-1 text-xs text-[#545454]">
                  <Star className="h-3.5 w-3.5 fill-black text-black" aria-hidden />
                  {Number(driver?.rating_avg ?? 5).toFixed(1)} / 5 ·{" "}
                  {driver?.rating_count ?? 0} avis
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 border-t border-[#EEEEEE] pt-5">
              <div className="flex items-start gap-3">
                <UberIconTile>
                  <Car className="h-5 w-5" aria-hidden />
                </UberIconTile>
                <div className="min-w-0">
                  <p className="uber-home-kicker">Véhicule</p>
                  <p className="uber-card-title mt-0.5">
                    {vehicle || "Non renseigné"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <UberTag>
                  {trip.available_seats} place
                  {trip.available_seats > 1 ? "s" : ""}
                </UberTag>
                {trip.accepts_parcels ? (
                  <UberTag tone="muted">
                    <span className="inline-flex items-center gap-1">
                      <Package size={12} aria-hidden />
                      Colis acceptés
                    </span>
                  </UberTag>
                ) : null}
              </div>
            </div>
          </UberCard>

          <UberCard>
            <p className="uber-home-kicker m-0">Réserver</p>
            <div className="mt-3">
              <BookingForm
                tripId={trip.id}
                availableSeats={trip.available_seats}
                pricePerSeat={Number(trip.price_per_seat)}
                acceptsParcels={trip.accepts_parcels}
                parcelBasePrice={Number(trip.parcel_base_price)}
                loggedIn={Boolean(user)}
              />
            </div>
          </UberCard>
        </div>
      </div>
    </SitePage>
  );
}
