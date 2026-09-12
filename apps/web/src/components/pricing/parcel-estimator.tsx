"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  estimerPrixColis,
  PLANCHER_PRIX_CLIENT,
} from "@livre-moi/shared/pricing";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { EstimateMapDynamic } from "@/components/maps/estimate-map-dynamic";
import { Checkbox } from "@/components/ui/checkbox";
import { getParcelRouteDistance, type ParcelRouteEstimate } from "@/lib/actions/pricing";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChartPie, Gauge, Zap } from "lucide-react";

const WEIGHT_MIN = 0.5;
const WEIGHT_MAX = 30;
const WEIGHT_STEP = 0.5;
const WEIGHT_TICKS = [1, 5, 10, 20, 30];

const HOW_STEPS = [
  {
    n: "01",
    title: "Estimez",
    text: "Entrez les détails de votre colis pour obtenir une fourchette de prix.",
  },
  {
    n: "02",
    title: "Publiez",
    text: "Créez votre annonce en un clic. Vos données sont pré-remplies.",
  },
  {
    n: "03",
    title: "Négociez",
    text: "Les conducteurs vous proposent un prix. Vous acceptez celui qui vous convient.",
  },
] as const;

const EMPTY_POINTS = [
  {
    icon: Zap,
    text: "Résultat instantané basé sur la distance réelle",
  },
  {
    icon: Gauge,
    text: "Fourchette min / max selon le marché",
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

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${String(rest).padStart(2, "0")}`;
}

function formatWeight(kg: number) {
  return `${kg.toLocaleString("fr-CA", { maximumFractionDigits: 1 })} kg`;
}

function FieldSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export function ParcelEstimator() {
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [weight, setWeight] = useState(1);
  const [size, setSize] = useState<ParcelSize | null>(null);
  const [fragile, setFragile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<
    (ParcelRouteEstimate & { origin: GeoPoint; destination: GeoPoint }) | null
  >(null);
  const [itinerary, setItinerary] = useState<"shortest" | "fastest">("shortest");

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
    return estimerPrixColis(selectedRoute.distanceKm, weight);
  }, [selectedRoute, weight]);

  useEffect(() => {
    setRoutes(null);
    setError(null);
  }, [origin, destination]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Choisissez un départ et une destination dans la liste.");
      return;
    }

    setLoading(true);
    setError(null);
    const result = await getParcelRouteDistance({
      originLat: origin.lat,
      originLng: origin.lng,
      destLat: destination.lat,
      destLng: destination.lng,
    });
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
          date: new Date().toISOString().slice(0, 10),
          weight: String(weight),
          price: String(estimation.prixClient),
          distance: String(selectedRoute.distanceKm),
          ...(size ? { size } : {}),
          ...(fragile ? { fragile: "1" } : {}),
        }).toString()}`
      : "/colis/nouveau";

  const weightPct = ((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100;
  const selectedFormat = PARCEL_FORMATS.find((format) => format.value === size);

  return (
    <div className="space-y-6 lg:space-y-8">
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(20rem,28rem)_1fr] lg:items-stretch lg:gap-8">
      <div className="space-y-7 rounded-3xl border border-[#E8E8E8] bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black md:text-3xl dark:text-white">
            Combien coûte l&apos;envoi d&apos;un colis ?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Québec et Ontario · transport collaboratif. Indiquez le départ, la
            destination et le poids pour un prix indicatif.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-7">
          <FieldSection title="Format du colis">
            <div
              className="grid grid-cols-4 gap-3"
              role="group"
              aria-label="Format du colis"
            >
              {PARCEL_FORMATS.map(({ size: formatSize, value, icon: Icon }) => {
                const selected = size === value;
                return (
                  <div
                    key={value}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <button
                      type="button"
                      aria-label={`Format ${formatSize}`}
                      aria-pressed={selected}
                      onClick={() => setSize(value)}
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                        selected
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-[#F6F6F6] text-black hover:bg-[#EDEDED] dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                    {selected ? (
                      <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-center text-xs font-semibold whitespace-nowrap text-black dark:bg-white/10 dark:text-neutral-300">
                        Format {formatSize}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {selectedFormat ? (
              <p className="text-sm font-semibold leading-snug text-black dark:text-white">
                {selectedFormat.label}
              </p>
            ) : null}
            <label
              htmlFor="est-fragile"
              className="inline-flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-black dark:text-white"
            >
              <Checkbox
                id="est-fragile"
                checked={fragile}
                onCheckedChange={(checked) => setFragile(checked === true)}
              />
              Colis fragile
            </label>
          </FieldSection>

          <FieldSection title="Adresse de départ">
            <AddressAutocomplete
              id="est-origin"
              placeholder="Ville ou adresse de départ…"
              value={origin}
              onChange={setOrigin}
              variant="gooey"
            />
          </FieldSection>

          <FieldSection title="Adresse de destination">
            <AddressAutocomplete
              id="est-destination"
              placeholder="Ville ou adresse d'arrivée…"
              value={destination}
              onChange={setDestination}
              variant="gooey"
            />
          </FieldSection>

          <FieldSection title="Poids">
            <p className="text-3xl font-bold tracking-tight text-black dark:text-white">
              {formatWeight(weight)}
            </p>
            <input
              id="est-weight"
              type="range"
              min={WEIGHT_MIN}
              max={WEIGHT_MAX}
              step={WEIGHT_STEP}
              value={weight}
              aria-label="Poids du colis"
              aria-valuemin={WEIGHT_MIN}
              aria-valuemax={WEIGHT_MAX}
              aria-valuenow={weight}
              aria-valuetext={formatWeight(weight)}
              onChange={(event) => setWeight(Number(event.target.value))}
              className="parcel-weight-slider mt-1 w-full cursor-pointer appearance-none bg-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, #000 ${weightPct}%, #E8E8E8 ${weightPct}%)`,
              }}
            />
            <div className="flex justify-between gap-1 pt-1">
              {WEIGHT_TICKS.map((tick) => (
                <button
                  key={tick}
                  type="button"
                  onClick={() => setWeight(tick)}
                  className={cn(
                    "text-[11px] font-medium text-neutral-400 transition-colors hover:text-black dark:hover:text-white",
                    weight === tick && "text-black dark:text-white",
                  )}
                >
                  {tick} kg
                </button>
              ))}
            </div>
          </FieldSection>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!estimation ? (
            <button
              type="submit"
              disabled={loading}
              className="btn-brand w-full disabled:opacity-50"
            >
              {loading ? "Calcul en cours…" : "Estimer le coût"}
            </button>
          ) : null}
        </form>
      </div>

      <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-[#E8E8E8] bg-white shadow-xl shadow-black/5 lg:sticky lg:top-24 lg:min-h-[calc(100vh-8rem)] dark:border-white/10 dark:bg-neutral-900">
        <div className="absolute inset-0">
          <EstimateMapDynamic
            origin={origin}
            destination={destination}
            activeRoute={selectedRoute?.coordinates}
            alternateRoute={alternateRoute?.coordinates}
          />
        </div>
        {loading ? (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-white/70 text-sm font-medium text-neutral-600 dark:bg-black/40 dark:text-neutral-200">
            Calcul de l&apos;itinéraire…
          </div>
        ) : null}
      </div>
    </div>

    <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
      {estimation && selectedRoute && routes ? (
        <div className="space-y-5 rounded-3xl border border-[#E8E8E8] bg-white p-8 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          {routes.distinct ? (
            <FieldSection title="Itinéraire">
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Choix d'itinéraire">
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
                        "rounded-2xl border px-3 py-3 text-left transition-colors",
                        selected
                          ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                          : "border-[#E8E8E8] bg-[#FAFAFA] text-neutral-700 hover:border-neutral-400 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200",
                      )}
                    >
                      <span className="block text-sm font-semibold">{choice.label}</span>
                      <span
                        className={cn(
                          "mt-1 block text-xs",
                          selected ? "text-white/80 dark:text-black/70" : "text-neutral-500",
                        )}
                      >
                        {choice.option.distanceKm} km · {formatDuration(choice.option.durationMin)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </FieldSection>
          ) : null}

          <div>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Prix estimé
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-black dark:text-white">
              {cad.format(estimation.prixClient)}
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {selectedRoute.distanceKm} km · environ {formatDuration(selectedRoute.durationMin)}
              {!routes.distinct ? " · plus court et plus rapide" : ""}
            </p>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-neutral-500">Conducteur</dt>
              <dd className="font-medium text-neutral-800 dark:text-neutral-200">
                {cad.format(estimation.remunerationConducteur)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-neutral-500">Plateforme</dt>
              <dd className="font-medium text-neutral-800 dark:text-neutral-200">
                {cad.format(estimation.commissionPlateforme)}
              </dd>
            </div>
          </dl>

          <p className="text-xs leading-relaxed text-neutral-500">
            Estimation basée sur l&apos;itinéraire routier et le poids. Prix
            plancher de {cad.format(PLANCHER_PRIX_CLIENT)}. Le montant final peut
            varier selon le trajet réel du conducteur.
          </p>

          <Link href={publishHref} className="btn-brand w-full">
            Publier un colis
          </Link>
        </div>
      ) : (
        <div className="space-y-5 rounded-3xl border-2 border-dashed border-[#E8E8E8] bg-white p-10 text-center dark:border-white/15 dark:bg-neutral-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F6F6F6] text-neutral-400 dark:bg-neutral-800">
            <Gauge className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-black dark:text-white">
              Votre estimation apparaîtra ici
            </p>
            <p className="text-sm leading-relaxed text-neutral-500">
              Remplissez le formulaire et cliquez sur « Estimer le coût ».
            </p>
          </div>
          <ul className="space-y-3 text-left text-sm text-neutral-600 dark:text-neutral-400">
            {EMPTY_POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-3xl border border-[#E8E8E8] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          Comment ça marche ?
        </p>
        <ol className="mt-5 space-y-5">
          {HOW_STEPS.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="w-8 shrink-0 text-sm font-bold text-neutral-300 dark:text-neutral-600">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-black dark:text-white">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
    </div>
  );
}
