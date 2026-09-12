import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPinned,
  Package,
  TriangleAlert,
  Weight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EstimateMapDynamic } from "@/components/maps/estimate-map-dynamic";
import { ParcelListingActions } from "@/components/parcels/parcel-listing-actions";
import { getParcelRouteDistance } from "@/lib/actions/pricing";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import { PARCEL_LISTING_STATUS_LABELS } from "@/lib/constants";
import type { GeoPoint, ParcelListing } from "@/lib/types";

const WEEKDAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

function formatDesiredDate(value: string): { label: string; weekday?: string } {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return { label: value };
  const utc = new Date(Date.UTC(year, month - 1, day));
  return {
    label: `${day} ${MONTHS[month - 1]} ${year}`,
    weekday: WEEKDAYS[utc.getUTCDay()],
  };
}

function formatKg(kg: number) {
  return `${String(kg).replace(".", ",")} kg`;
}

function formatKm(km: number) {
  const rounded = Math.round(km * 10) / 10;
  const label = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1).replace(".", ",");
  return `${label} km`;
}

function shortPlace(name: string) {
  return name.split(",")[0]?.trim() || name;
}

function Fact({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F6F6F6] px-4 py-3.5 dark:bg-neutral-800">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 text-base font-semibold tracking-tight text-black dark:text-white">
        {value}
      </dd>
      {hint ? (
        <p className="mt-0.5 text-xs leading-snug text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default async function ParcelListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("parcel_listings")
    .select(
      "id, user_id, title, description, origin_name, origin_lat, origin_lng, destination_name, dest_lat, dest_lng, parcel_size, weight_kg, is_fragile, estimated_price, distance_km, desired_date, recipient_name, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const listing = data as ParcelListing;
  const isOwner = Boolean(user && user.id === listing.user_id);
  let acceptsParcels = false;
  let identityVerified = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("accepts_parcels, identity_verified")
      .eq("id", user.id)
      .maybeSingle();
    acceptsParcels = Boolean(profile?.accepts_parcels);
    identityVerified = Boolean(profile?.identity_verified);
  }
  const format = PARCEL_FORMATS.find((item) => item.value === listing.parcel_size);
  const price =
    listing.estimated_price == null
      ? null
      : new Intl.NumberFormat("fr-CA", {
          style: "currency",
          currency: "CAD",
        }).format(Number(listing.estimated_price));

  const originLat = Number(listing.origin_lat);
  const originLng = Number(listing.origin_lng);
  const destLat = Number(listing.dest_lat);
  const destLng = Number(listing.dest_lng);
  const hasCoords = [originLat, originLng, destLat, destLng].every(Number.isFinite);

  const origin: GeoPoint | null = hasCoords
    ? { lat: originLat, lng: originLng, name: listing.origin_name }
    : null;
  const destination: GeoPoint | null = hasCoords
    ? { lat: destLat, lng: destLng, name: listing.destination_name }
    : null;

  const routeResult = hasCoords
    ? await getParcelRouteDistance({
        originLat,
        originLng,
        destLat,
        destLng,
      })
    : null;
  const route = routeResult?.ok ? routeResult.data.shortest.coordinates : undefined;
  const desiredDate = listing.desired_date
    ? formatDesiredDate(listing.desired_date)
    : null;

  return (
    <section className="section-muted">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:py-10 lg:grid-cols-2 lg:items-stretch lg:gap-8 lg:py-12">
        <div className="space-y-6 rounded-3xl border border-[#E8E8E8] bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/colis"
              className="text-sm text-neutral-500 underline-offset-4 hover:underline"
            >
              ← Toutes les annonces
            </Link>
            {isOwner ? (
              <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase dark:bg-white dark:text-black">
                Mon colis
              </span>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              {PARCEL_LISTING_STATUS_LABELS[listing.status] ?? listing.status}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-black dark:text-white">
              {listing.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-black dark:text-white">
              {shortPlace(listing.origin_name)} → {shortPlace(listing.destination_name)}
            </p>
          </div>

          {price ? (
            <div>
              <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Prix estimé
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-black dark:text-white">
                {price}
              </p>
            </div>
          ) : null}

          {listing.is_fragile ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 dark:bg-amber-500/15 dark:text-amber-200">
              <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
              Colis fragile — à manipuler avec soin
            </p>
          ) : null}

          <dl className="grid grid-cols-2 gap-3">
            <Fact
              icon={format?.icon ?? Package}
              label="Format"
              value={format ? `Format ${format.size}` : listing.parcel_size}
              hint={format?.label.replace(/^[^—]+—\s*/, "")}
            />
            <Fact
              icon={Weight}
              label="Poids"
              value={formatKg(Number(listing.weight_kg))}
            />
            {listing.distance_km != null ? (
              <Fact
                icon={MapPinned}
                label="Distance"
                value={formatKm(Number(listing.distance_km))}
              />
            ) : null}
            {desiredDate ? (
              <Fact
                icon={CalendarDays}
                label="Date souhaitée"
                value={desiredDate.label}
                hint={desiredDate.weekday}
              />
            ) : null}
          </dl>

          <div className="space-y-3 border-t border-[#E8E8E8] pt-5 text-sm dark:border-white/10">
            <div>
              <p className="text-xs font-medium text-neutral-500">Départ</p>
              <p className="mt-0.5 font-medium leading-snug text-black dark:text-white">
                {listing.origin_name}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-neutral-500">Arrivée</p>
              <p className="mt-0.5 font-medium leading-snug text-black dark:text-white">
                {listing.destination_name}
              </p>
            </div>
          </div>

          {listing.description ? (
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {listing.description}
            </p>
          ) : null}

          <ParcelListingActions
            listingId={listing.id}
            isOwner={isOwner}
            isLoggedIn={Boolean(user)}
            acceptsParcels={acceptsParcels}
            identityVerified={identityVerified}
          />
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-[#E8E8E8] bg-white shadow-xl shadow-black/5 lg:min-h-0 dark:border-white/10 dark:bg-neutral-900">
          <div className="absolute inset-0">
            <EstimateMapDynamic
              origin={origin}
              destination={destination}
              activeRoute={route}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
