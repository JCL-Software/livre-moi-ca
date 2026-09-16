import { notFound } from "next/navigation";
import {
  CalendarDays,
  MapPinned,
  Package,
  Shapes,
  TriangleAlert,
  Weight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EstimateMapDynamic } from "@/components/maps/estimate-map-dynamic";
import { ParcelListingActions } from "@/components/parcels/parcel-listing-actions";
import { ParcelDeliveryPrivate } from "@/components/parcels/parcel-delivery-private";
import { UberCard, UberIconTile, UberTag } from "@/components/baseweb/uber-ui";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { getParcelRouteDistance } from "@/lib/actions/pricing";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import { parcelListingPhotoUrl } from "@/lib/parcel-photo";
import { PARCEL_CATEGORY_LABELS, PARCEL_LISTING_STATUS_LABELS } from "@/lib/constants";
import { shortPlace } from "@/lib/account-format";
import type { ExistingParcelOffer, GeoPoint, ParcelListing } from "@/lib/types";
import { getExistingParcelOffer, getParcelDeliveryDetails } from "@livre-moi/shared/data";
import {
  formatPrixCad,
  suggestedPriceFromListing,
} from "@livre-moi/shared/pricing";

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
    <div className="flex items-start gap-3">
      <UberIconTile>
        <Icon className="h-5 w-5" aria-hidden />
      </UberIconTile>
      <div className="min-w-0">
        <p className="uber-home-kicker">{label}</p>
        <p className="uber-card-title mt-0.5">{value}</p>
        {hint ? (
          <p className="mt-0.5 mb-0 text-xs leading-snug text-[#545454]">{hint}</p>
        ) : null}
      </div>
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
      "id, user_id, title, description, origin_name, origin_lat, origin_lng, destination_name, dest_lat, dest_lng, parcel_size, category, category_detail, weight_kg, is_fragile, estimated_price, distance_km, desired_date, photo_url, status, matched_conversation_id, agreed_price, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const listing = data as ParcelListing;
  const photoSrc = parcelListingPhotoUrl(listing.photo_url);
  const isOwner = Boolean(user && user.id === listing.user_id);
  const deliveryDetails = user
    ? await getParcelDeliveryDetails(supabase, listing.id)
    : null;
  let acceptsParcels = false;
  let identityVerified = false;
  let existingOffer: ExistingParcelOffer | null = null;
  if (user) {
    const [profileResult, offer] = await Promise.all([
      supabase
        .from("profiles")
        .select("accepts_parcels, identity_verified")
        .eq("id", user.id)
        .maybeSingle(),
      getExistingParcelOffer(supabase, listing.id, user.id),
    ]);
    acceptsParcels = Boolean(profileResult.data?.accepts_parcels);
    identityVerified = Boolean(profileResult.data?.identity_verified);
    existingOffer = offer;
  }
  const existingConversationId = existingOffer?.conversationId ?? null;
  const isChosenTransporter = Boolean(
    existingConversationId &&
      listing.matched_conversation_id === existingConversationId,
  );
  const suggestedPrice = suggestedPriceFromListing(listing);
  const agreedPrice =
    listing.agreed_price == null ? null : Number(listing.agreed_price);
  const format = PARCEL_FORMATS.find((item) => item.value === listing.parcel_size);
  const suggestedLabel = formatPrixCad(suggestedPrice);
  const agreedLabel = agreedPrice == null ? null : formatPrixCad(agreedPrice);

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
    <SitePage>
      <SiteBackLink href="/colis">Toutes les annonces</SiteBackLink>
      <UberPageIntro
        kicker={PARCEL_LISTING_STATUS_LABELS[listing.status] ?? listing.status}
        title={listing.title}
        subtitle={`${shortPlace(listing.origin_name)} → ${shortPlace(listing.destination_name)}`}
        action={isOwner ? <UberTag tone="solid">Mon colis</UberTag> : null}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <UberCard className="flex flex-col gap-6">
          {photoSrc ? (
            <div className="overflow-hidden rounded-lg bg-[#F6F6F6]">
              <img
                src={photoSrc}
                alt="Photo du colis"
                className="max-h-80 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-[#EEEEEE]">
              <Package className="h-12 w-12 text-[#B3B3B3]" strokeWidth={1.5} aria-hidden />
            </div>
          )}

          <div>
            <p className="uber-home-kicker m-0">
              {agreedLabel ? "Prix convenu" : "Prix"}
            </p>
            <p className="uber-price mt-1 mb-0">
              {agreedLabel ?? suggestedLabel}
            </p>
            <p className="mt-1 mb-0 text-xs text-[#545454]">
              {agreedLabel
                ? `Prix suggéré : ${suggestedLabel}`
                : "Tarif de départ — un autre montant peut se proposer dans le tchat."}
            </p>
          </div>

          {listing.is_fragile ? (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-900">
              <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
              <span>Colis fragile — à manipuler avec soin</span>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-4">
            <Fact
              icon={Shapes}
              label="Type"
              value={
                listing.category === "OTHER" && listing.category_detail
                  ? listing.category_detail
                  : listing.category
                    ? PARCEL_CATEGORY_LABELS[listing.category]
                    : "Colis"
              }
            />
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
          </div>

          <div className="space-y-3 border-t border-[#EEEEEE] pt-5 text-sm">
            <div>
              <p className="uber-home-kicker m-0">Départ</p>
              <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
                {listing.origin_name}
              </p>
            </div>
            <div>
              <p className="uber-home-kicker m-0">Arrivée</p>
              <p className="mt-0.5 mb-0 font-medium leading-snug text-black">
                {listing.destination_name}
              </p>
            </div>
          </div>

          {deliveryDetails ? (
            <ParcelDeliveryPrivate
              details={deliveryDetails}
              originName={listing.origin_name}
              destinationName={listing.destination_name}
            />
          ) : null}

          {listing.description ? (
            <div className="rounded-lg bg-[#F6F6F6] px-4 py-4">
              <p className="uber-home-kicker m-0">Description</p>
              <p className="mt-2 mb-0 text-[15px] leading-7 text-black">
                {listing.description}
              </p>
            </div>
          ) : null}

          <ParcelListingActions
            listingId={listing.id}
            isOwner={isOwner}
            isLoggedIn={Boolean(user)}
            acceptsParcels={acceptsParcels}
            identityVerified={identityVerified}
            listingStatus={listing.status}
            existingConversationId={existingConversationId}
            isChosenTransporter={isChosenTransporter}
            suggestedPrice={suggestedPrice}
            agreedPrice={agreedPrice}
          />
        </UberCard>

        <UberCard padded={false} className="relative min-h-[360px] overflow-hidden lg:min-h-0">
          <div className="absolute inset-0">
            <EstimateMapDynamic
              origin={origin}
              destination={destination}
              activeRoute={route}
            />
          </div>
        </UberCard>
      </div>
    </SitePage>
  );
}
