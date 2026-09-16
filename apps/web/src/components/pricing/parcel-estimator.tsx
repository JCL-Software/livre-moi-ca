"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpDown, ChartPie, Gauge, Zap } from "lucide-react";
import { estimerPrixColis } from "@livre-moi/shared/pricing";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { UberCard } from "@/components/baseweb/uber-ui";
import { EstimateMapDynamic } from "@/components/maps/estimate-map-dynamic";
import { getParcelRouteDistance, type ParcelRouteEstimate } from "@/lib/actions/pricing";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 100;
const WEIGHT_STEP = 0.5;
/** Graduations régulièrement espacées — alignées sur le curseur linéaire. */
const WEIGHT_TICKS = [0, 20, 40, 60, 80, 100];
const WEIGHT_THUMB_PX = 20;

function weightPercent(value: number) {
  return ((value - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100;
}

const HOW_STEPS = [
  {
    n: "01",
    title: "Estimez",
    text: "Indiquez le départ, la destination et le poids pour un prix indicatif.",
  },
  {
    n: "02",
    title: "Publiez",
    text: "Votre annonce est publique : tous les utilisateurs peuvent la voir.",
  },
  {
    n: "03",
    title: "Choisissez",
    text: "Les conducteurs vous proposent un tarif. Vous retenez l’offre qui vous convient.",
  },
] as const;

const EMPTY_POINTS = [
  {
    icon: Zap,
    text: "Résultat instantané basé sur la distance réelle",
  },
  {
    icon: Gauge,
    text: "Un prix indicatif, selon le poids et le trajet",
  },
  {
    icon: ChartPie,
    text: "Composition du prix : conducteur et plateforme",
  },
] as const;

const cad = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
});

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="uber-home-kicker mb-1.5 block">
      {children}
    </label>
  );
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${String(rest).padStart(2, "0")}`;
}

function formatKm(km: number) {
  return `${Math.round(km).toLocaleString("fr-CA")} km`;
}

function formatWeight(kg: number) {
  return `${kg.toLocaleString("fr-CA", { maximumFractionDigits: 1 })} kg`;
}

function formatWeightNumber(kg: number) {
  return kg.toLocaleString("fr-CA", { maximumFractionDigits: 1 });
}

function isWeightDraft(value: string) {
  return /^\d*(?:[.,]\d{0,1})?$/.test(value.trim());
}

function parseWeightDraft(value: string) {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized || normalized === ".") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampWeight(value: number) {
  return Math.min(
    WEIGHT_MAX,
    Math.max(0.5, Math.round(value * 10) / 10),
  );
}

type ParcelEstimatorProps = {
  initialOrigin?: GeoPoint | null;
  initialDestination?: GeoPoint | null;
  initialDate?: string;
  initialTime?: string;
  initialSize?: ParcelSize | null;
  initialWeight?: number;
  initialFragile?: boolean;
  returnToPublish?: boolean;
};

export function ParcelEstimator({
  initialOrigin = null,
  initialDestination = null,
  initialDate,
  initialTime,
  initialSize = null,
  initialWeight,
  initialFragile = false,
  returnToPublish = false,
}: ParcelEstimatorProps) {
  const [origin, setOrigin] = useState<GeoPoint | null>(initialOrigin);
  const [destination, setDestination] = useState<GeoPoint | null>(
    initialDestination,
  );
  const [weight, setWeight] = useState(initialWeight ?? 1);
  const [weightDraft, setWeightDraft] = useState(
    String(initialWeight ?? 1),
  );
  const [size, setSize] = useState<ParcelSize | null>(initialSize);
  const [fragile, setFragile] = useState(initialFragile);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<
    (ParcelRouteEstimate & { origin: GeoPoint; destination: GeoPoint }) | null
  >(null);
  const [itinerary, setItinerary] = useState<"shortest" | "fastest">("shortest");
  const [routeRetry, setRouteRetry] = useState(0);

  const selectedRoute = routes
    ? itinerary === "fastest" && routes.distinct
      ? routes.fastest
      : routes.shortest
    : null;
  const alternateRoute = routes?.distinct
    ? itinerary === "fastest"
      ? routes.shortest
      : routes.fastest
    : undefined;

  const estimation = useMemo(() => {
    if (!selectedRoute) return null;
    return estimerPrixColis(
      selectedRoute.distanceKm,
      weight,
      size ?? "SMALL",
    );
  }, [selectedRoute, weight, size]);

  const publishDate =
    initialDate && initialTime
      ? `${initialDate}T${initialTime}`
      : (initialDate ?? new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (!origin || !destination) {
      setRoutes(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    getParcelRouteDistance({
      originLat: origin.lat,
      originLng: origin.lng,
      destLat: destination.lat,
      destLng: destination.lng,
    }).then((result) => {
      if (cancelled) return;
      setLoading(false);
      if (!result.ok) {
        setRoutes(null);
        setError(result.error);
        return;
      }
      setItinerary("shortest");
      setRoutes({
        ...result.data,
        origin,
        destination,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [origin, destination, routeRetry]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Choisissez un départ et une destination dans la liste.");
      return;
    }
    setRouteRetry((current) => current + 1);
  }

  const publishHref =
    routes && estimation && selectedRoute
      ? `/colis/nouveau?${new URLSearchParams({
          origin: routes.origin.name,
          olat: String(routes.origin.lat),
          olng: String(routes.origin.lng),
          dest: routes.destination.name,
          dlat: String(routes.destination.lat),
          dlng: String(routes.destination.lng),
          date: publishDate,
          weight: String(weight),
          price: String(estimation.prixClient),
          distance: String(selectedRoute.distanceKm),
          step: "1",
          ...(size ? { size } : {}),
          ...(fragile ? { fragile: "1" } : {}),
        }).toString()}`
      : returnToPublish
        ? "/colis/nouveau?step=1"
        : "/colis/nouveau";

  const weightPct = weightPercent(weight);
  const selectedFormat = PARCEL_FORMATS.find((format) => format.value === size);

  function commitWeight(next: number) {
    const clamped = clampWeight(next);
    setWeight(clamped);
    setWeightDraft(formatWeightNumber(clamped));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,1fr)] lg:items-start">
      <div className="space-y-5">
        <UberCard>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="relative">
              <div>
                <FieldLabel htmlFor="est-origin">Prise en charge</FieldLabel>
                <AddressAutocomplete
                  id="est-origin"
                  placeholder="Lieu de prise en charge"
                  value={origin}
                  onChange={setOrigin}
                  variant="uber"
                  locate
                />
              </div>
              <div className="relative box-content h-9 py-4">
                <div className="pointer-events-none absolute left-0 top-1/2 z-20 flex h-9 w-14 -translate-y-1/2 items-center justify-center">
                  <button
                    type="button"
                    aria-label="Inverser origine et destination"
                    onClick={() => {
                      setOrigin(destination);
                      setDestination(origin);
                    }}
                    className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EEEEEE] text-black shadow-sm hover:bg-[#E4E4E4]"
                  >
                    <ArrowUpDown className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="est-destination">Destination</FieldLabel>
                <AddressAutocomplete
                  id="est-destination"
                  placeholder="Destination"
                  value={destination}
                  onChange={setDestination}
                  variant="uber"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Format du colis</FieldLabel>
              <div className="grid grid-cols-4 gap-2" role="group" aria-label="Format du colis">
                {PARCEL_FORMATS.map(({ size: formatSize, value, icon: Icon }) => {
                  const selected = size === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-label={`Format ${formatSize}`}
                      aria-pressed={selected}
                      onClick={() => setSize(value)}
                      className={cn(
                        "inline-flex h-12 items-center justify-center rounded-lg text-sm font-semibold",
                        selected
                          ? "bg-black text-white"
                          : "bg-[#EEEEEE] text-black hover:bg-[#E4E4E4]",
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                      <span className="sr-only">{formatSize}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 mb-0 text-[15px] leading-5 text-[#545454]">
                {selectedFormat?.label ?? "Choisissez le format qui tient dans le véhicule."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setFragile((value) => !value)}
              className={cn(
                "w-full rounded-lg px-4 py-3 text-left text-sm font-medium",
                fragile ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
              )}
            >
              Colis fragile
            </button>

            <div>
              <FieldLabel htmlFor="est-weight">Poids</FieldLabel>
              <div className="relative">
                <input
                  id="est-weight"
                  inputMode="decimal"
                  autoComplete="off"
                  value={weightDraft}
                  aria-describedby="est-weight-unit"
                  onChange={(event) => {
                    const next = event.target.value;
                    if (!isWeightDraft(next)) return;
                    setWeightDraft(next);
                    const parsed = parseWeightDraft(next);
                    if (parsed != null && parsed >= 0.5) {
                      setWeight(clampWeight(parsed));
                    }
                  }}
                  onBlur={() => {
                    const parsed = parseWeightDraft(weightDraft);
                    commitWeight(parsed ?? weight);
                  }}
                  className="uber-price h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 pr-14 text-left outline-none focus:ring-2 focus:ring-black"
                />
                <span
                  id="est-weight-unit"
                  className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-[#545454]"
                >
                  kg
                </span>
              </div>
              <input
                id="est-weight-slider"
                type="range"
                min={WEIGHT_MIN}
                max={WEIGHT_MAX}
                step={WEIGHT_STEP}
                value={weight}
                aria-label="Régler le poids du colis"
                aria-valuemin={WEIGHT_MIN}
                aria-valuemax={WEIGHT_MAX}
                aria-valuenow={weight}
                aria-valuetext={formatWeight(weight)}
                onChange={(event) => commitWeight(Number(event.target.value))}
                className="parcel-weight-slider mt-3 w-full cursor-pointer appearance-none bg-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, #000 ${weightPct}%, #E8E8E8 ${weightPct}%)`,
                }}
              />
              <div
                className="mt-1 flex h-5 justify-between"
                style={{
                  marginLeft: WEIGHT_THUMB_PX / 2,
                  marginRight: WEIGHT_THUMB_PX / 2,
                }}
              >
                {WEIGHT_TICKS.map((tick) => (
                  <button
                    key={tick}
                    type="button"
                    onClick={() => commitWeight(tick === 0 ? 0.5 : tick)}
                    className={cn(
                      "whitespace-nowrap text-[11px] font-medium text-[#9A9A9A] transition-colors hover:text-black",
                      (tick === 0 ? weight <= 0.5 : weight === tick) &&
                        "text-black",
                    )}
                  >
                    {tick} kg
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <p className="uber-error" role="alert">
                {error}
              </p>
            ) : null}

            {!estimation ? (
              <button
                type="submit"
                disabled={loading}
                className="btn-brand h-12 w-full disabled:opacity-50 sm:w-auto sm:px-6"
              >
                {loading ? "Calcul en cours…" : "Estimer le coût"}
              </button>
            ) : null}
          </form>
        </UberCard>

        <UberCard>
          <p className="uber-home-kicker m-0">Comment ça marche</p>
          <ol className="mt-4 mb-0 space-y-4">
            {HOW_STEPS.map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="w-7 shrink-0 text-sm font-bold text-[#9A9A9A]">
                  {step.n}
                </span>
                <div>
                  <p className="m-0 font-semibold text-black">{step.title}</p>
                  <p className="mt-1 mb-0 text-sm leading-5 text-[#545454]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </UberCard>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24">
        <div className="relative min-h-[360px] overflow-hidden rounded-[12px] border border-[#EEEEEE] bg-white lg:min-h-[420px]">
          <div className="absolute inset-0">
            <EstimateMapDynamic
              origin={origin}
              destination={destination}
              activeRoute={selectedRoute?.coordinates}
              alternateRoute={alternateRoute?.coordinates}
              deferUntilPins
            />
          </div>
          {loading ? (
            <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/70 text-sm font-medium text-[#545454]">
              Calcul de l&apos;itinéraire…
            </div>
          ) : null}
        </div>

        {estimation && selectedRoute && routes ? (
          <UberCard>
            <div className="flex items-start justify-between gap-4">
              <p className="uber-home-kicker m-0">Prix indicatif</p>
              <p className="uber-price m-0 text-right">
                {cad.format(estimation.prixClient)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex h-8 items-center rounded-full bg-[#EEEEEE] px-3 text-sm font-medium text-black">
                {formatKm(selectedRoute.distanceKm)}
              </span>
              <span className="inline-flex h-8 items-center rounded-full bg-[#EEEEEE] px-3 text-sm font-medium text-black">
                {formatDuration(selectedRoute.durationMin)}
              </span>
            </div>

            {routes.distinct ? (
              <div
                className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-[#EEEEEE] p-1"
                role="group"
                aria-label="Choix d'itinéraire"
              >
                {(
                  [
                    {
                      id: "shortest" as const,
                      label: "Plus court",
                      option: routes.shortest,
                    },
                    {
                      id: "fastest" as const,
                      label: "Plus rapide",
                      option: routes.fastest,
                    },
                  ]
                ).map((choice) => {
                  const selected = itinerary === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setItinerary(choice.id)}
                      className={cn(
                        "rounded-md px-3 py-2 text-left text-sm font-semibold",
                        selected
                          ? "bg-black text-white"
                          : "text-black hover:bg-[#E4E4E4]",
                      )}
                    >
                      <span className="block">{choice.label}</span>
                      <span
                        className={cn(
                          "mt-0.5 block text-xs font-medium",
                          selected ? "text-white/70" : "text-[#545454]",
                        )}
                      >
                        {formatKm(choice.option.distanceKm)} ·{" "}
                        {formatDuration(choice.option.durationMin)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            <dl className="mt-5 space-y-2.5 border-t border-[#EEEEEE] pt-4 text-[15px] leading-5">
              <div className="flex justify-between gap-3">
                <dt className="text-[#545454]">Conducteur</dt>
                <dd className="m-0 font-medium text-black">
                  {cad.format(estimation.remunerationConducteur)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[#545454]">Plateforme</dt>
                <dd className="m-0 font-medium text-black">
                  {cad.format(estimation.commissionPlateforme)}
                </dd>
              </div>
            </dl>

            <p className="mt-4 mb-0 text-xs leading-5 text-[#545454]">
              Le conducteur peut vous proposer un autre montant. Vous choisissez
              l&apos;offre.
            </p>

            <Link href={publishHref} className="btn-brand mt-5 h-12 w-full">
              {returnToPublish
                ? "Reprendre la publication"
                : "Publier un colis"}
            </Link>
          </UberCard>
        ) : (
          <UberCard>
            <p className="uber-home-kicker m-0">Votre estimation</p>
            <p className="uber-card-title mt-3">
              Le prix indicatif apparaîtra ici
            </p>
            <p className="mt-2 mb-0 text-[15px] leading-5 text-[#545454]">
              Remplissez le formulaire, puis cliquez sur « Estimer le coût ».
            </p>
            <ul className="mt-4 mb-0 space-y-3 text-sm text-[#545454]">
              {EMPTY_POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEEEEE] text-black">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </UberCard>
        )}
      </aside>
    </div>
  );
}
