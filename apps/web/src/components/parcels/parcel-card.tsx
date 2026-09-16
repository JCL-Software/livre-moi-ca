import Link from "next/link";
import { Clock, Package } from "lucide-react";
import { publicStreetName } from "@livre-moi/shared/geo";
import { UberCard, UberTag } from "@/components/baseweb/uber-ui";
import { PARCEL_CATEGORY_LABELS } from "@/lib/constants";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import { parcelListingPhotoUrl } from "@/lib/parcel-photo";
import type { ParcelListing } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juill.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return `${WEEKDAYS[utc.getUTCDay()]} ${day} ${MONTHS[month - 1]}`;
}

export function ParcelCard({
  listing,
  isMine = false,
  preview = false,
  coverSrc,
}: {
  listing: ParcelListing;
  isMine?: boolean;
  preview?: boolean;
  coverSrc?: string | null;
}) {
  const format = PARCEL_FORMATS.find((item) => item.value === listing.parcel_size);
  const price =
    listing.estimated_price == null ? null : Number(listing.estimated_price);
  const photoSrc = coverSrc ?? parcelListingPhotoUrl(listing.photo_url);
  const categoryLabel = listing.category
    ? listing.category === "OTHER" && listing.category_detail?.trim()
      ? listing.category_detail.trim()
      : PARCEL_CATEGORY_LABELS[listing.category]
    : null;

  const card = (
    <UberCard
      as="article"
      padded={false}
      className={cn("h-full overflow-hidden", preview && "pointer-events-none")}
    >
      <div className="relative flex h-40 items-center justify-center bg-[#EEEEEE]">
        {photoSrc ? (
          <img
            src={photoSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Package className="h-12 w-12 text-[#B3B3B3]" strokeWidth={1.5} aria-hidden />
        )}
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="uber-card-title line-clamp-2">
              {listing.title}
            </p>
            <p className="text-sm font-medium text-[#545454]">
              {publicStreetName(listing.origin_name)} →{" "}
              {publicStreetName(listing.destination_name)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            {isMine ? <UberTag tone="solid">Mon colis</UberTag> : null}
            {price != null ? (
              <p className="m-0 text-right">
                <span className="uber-price">
                  {price.toFixed(0)} $
                </span>
                <span className="ml-1 text-xs text-[#545454]">suggéré</span>
              </p>
            ) : (
              <p className="m-0 text-sm font-medium text-[#545454]">Prix à convenir</p>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#545454]">
            {listing.desired_date ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={16} aria-hidden />
                {formatDate(listing.desired_date)}
              </span>
            ) : null}
            {listing.distance_km != null ? (
              <span>· {Number(listing.distance_km).toFixed(0)} km</span>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {categoryLabel ? <UberTag>{categoryLabel}</UberTag> : null}
            <UberTag>{format ? `Format ${format.size}` : listing.parcel_size}</UberTag>
            <UberTag tone="muted">
              {Number(listing.weight_kg).toLocaleString("fr-CA")} kg
            </UberTag>
            {listing.is_fragile ? <UberTag tone="muted">Fragile</UberTag> : null}
          </div>
        </div>
      </div>
    </UberCard>
  );

  if (preview) return card;

  return (
    <Link href={`/colis/${listing.id}`} className="block h-full no-underline">
      {card}
    </Link>
  );
}
