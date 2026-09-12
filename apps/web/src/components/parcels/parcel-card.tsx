import Link from "next/link";
import { Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { ParcelListing } from "@/lib/types";

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

function shortPlace(name: string) {
  return name.split(",")[0]?.trim() || name;
}

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const utc = new Date(Date.UTC(year, month - 1, day));
  return `${WEEKDAYS[utc.getUTCDay()]} ${day} ${MONTHS[month - 1]}`;
}

export function ParcelCard({
  listing,
  isMine = false,
}: {
  listing: ParcelListing;
  isMine?: boolean;
}) {
  const format = PARCEL_FORMATS.find((item) => item.value === listing.parcel_size);
  const FormatIcon = format?.icon ?? Package;
  const price =
    listing.estimated_price == null ? null : Number(listing.estimated_price);

  return (
    <Link href={`/colis/${listing.id}`} className="block h-full">
      <article className="feature-card flex h-full flex-col rounded-lg border border-neutral-200 bg-card p-5 shadow-sm before:hidden dark:border-white/10 dark:bg-card">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                <FormatIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 space-y-0.5">
                <p className="font-space line-clamp-2 text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  {listing.title}
                </p>
                <p className="font-sans text-sm font-medium text-slate-600 dark:text-slate-400">
                  {shortPlace(listing.origin_name)} →{" "}
                  {shortPlace(listing.destination_name)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {isMine ? (
                <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase dark:bg-white dark:text-black">
                  Mon colis
                </span>
              ) : null}
              {price != null ? (
                <p className="text-right">
                  <span className="font-space text-2xl font-extrabold text-slate-950 dark:text-white">
                    {price.toFixed(0)} $
                  </span>
                  <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                    estimé
                  </span>
                </p>
              ) : (
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Prix à convenir
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              {listing.desired_date ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-950 dark:text-white" />
                  {formatDate(listing.desired_date)}
                </span>
              ) : null}
              {listing.distance_km != null ? (
                <span>· {Number(listing.distance_km).toFixed(0)} km</span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-[#F6F6F6] text-slate-950 dark:bg-neutral-800 dark:text-white"
              >
                {format ? `Format ${format.size}` : listing.parcel_size}
              </Badge>
              <Badge
                variant="outline"
                className="border-[#E8E8E8] text-slate-600 dark:border-white/10 dark:text-slate-400"
              >
                {Number(listing.weight_kg).toLocaleString("fr-CA")} kg
              </Badge>
              {listing.is_fragile ? (
                <Badge
                  variant="outline"
                  className="border-[#E8E8E8] text-slate-600 dark:border-white/10 dark:text-slate-400"
                >
                  Fragile
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
