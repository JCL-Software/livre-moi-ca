"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { UberCalendarField } from "@/components/baseweb/uber-calendar";
import { UberCard } from "@/components/baseweb/uber-ui";
import { formatDateTime, formatMoney, shortPlace } from "@/lib/account-format";
import { publishTrip } from "@/lib/actions/trips";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, label: "Itinéraire" },
  { id: 1, label: "Places" },
  { id: 2, label: "Colis" },
] as const;

function formatCadDraft(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function parseCadDraft(raw: string) {
  const normalized = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized || normalized === "." || normalized === "-") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function isCadDraft(raw: string) {
  return raw === "" || /^\d{0,5}(,\d{0,2})?$/.test(raw);
}

function MoneyInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(() => formatCadDraft(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(formatCadDraft(value));
  }, [focused, value]);

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={draft}
        onFocus={() => setFocused(true)}
        onChange={(event) => {
          const next = event.target.value.replaceAll(".", ",");
          if (!isCadDraft(next)) return;
          setDraft(next);
          const parsed = parseCadDraft(next);
          if (parsed !== null) onChange(parsed);
        }}
        onBlur={() => {
          setFocused(false);
          const parsed = parseCadDraft(draft);
          if (parsed === null) {
            setDraft(formatCadDraft(value));
            return;
          }
          onChange(parsed);
          setDraft(formatCadDraft(parsed));
        }}
        className="uber-price h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 pr-16 text-left outline-none focus:ring-2 focus:ring-black"
      />
      <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-[#545454]">
        $ CAD
      </span>
    </div>
  );
}

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

function Stepper({
  current,
  reached,
  onSelect,
}: {
  current: number;
  reached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2" aria-label="Étapes de publication">
      {STEPS.map((item, index) => {
        const active = index === current;
        const done = index < current;
        const enabled = index <= reached;
        return (
          <li key={item.id} className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!enabled}
              onClick={() => onSelect(index)}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-full px-1 py-1 text-left",
                enabled ? "cursor-pointer" : "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  active || done
                    ? "bg-black text-white"
                    : "bg-[#EEEEEE] text-[#545454]",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-sm font-semibold",
                  active ? "text-black" : "text-[#545454]",
                )}
              >
                {item.label}
              </span>
            </button>
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  "hidden h-px min-w-4 flex-1 sm:block",
                  done ? "bg-black" : "bg-[#EEEEEE]",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center justify-between rounded-lg bg-[#EEEEEE] px-3 py-2">
        <button
          type="button"
          aria-label="Diminuer"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <p className="uber-home-title">{value}</p>
        <button
          type="button"
          aria-label="Augmenter"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function PublishTripForm({
  defaults,
}: {
  defaults?: {
    origin?: GeoPoint | null;
    destination?: GeoPoint | null;
    departureTime?: string;
  };
} = {}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState<GeoPoint | null>(defaults?.origin ?? null);
  const [destination, setDestination] = useState<GeoPoint | null>(
    defaults?.destination ?? null,
  );
  const [departureTime, setDepartureTime] = useState(
    defaults?.departureTime ?? "",
  );
  const [stops, setStops] = useState<GeoPoint[]>([]);
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(45);
  const [acceptsParcels, setAcceptsParcels] = useState(true);
  const [maxParcelSize, setMaxParcelSize] = useState<ParcelSize>("MEDIUM");
  const [parcelBasePrice, setParcelBasePrice] = useState(15);
  const [smoking, setSmoking] = useState(false);
  const [pets, setPets] = useState(false);
  const [note, setNote] = useState("");
  const [itineraryError, setItineraryError] = useState("");

  function goTo(next: number) {
    if (next > 0 && !canLeaveItinerary()) {
      const message = "Choisissez une origine, une destination et une date.";
      setItineraryError(message);
      toast.error(message);
      return;
    }
    setItineraryError("");
    setStep(next);
    setReached((current) => Math.max(current, next));
  }

  function canLeaveItinerary() {
    return Boolean(origin && destination && departureTime);
  }

  async function onSubmit() {
    if (!origin || !destination || !departureTime) {
      toast.error("Choisissez une origine, une destination et une date.");
      setStep(0);
      return;
    }
    setLoading(true);
    const result = await publishTrip({
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationName: destination.name,
      destLat: destination.lat,
      destLng: destination.lng,
      departureTime,
      totalSeats,
      pricePerSeat,
      acceptsParcels,
      maxParcelSize,
      parcelBasePrice,
      parcelPricePerKg: 0,
      intermediateStops: stops.map((stop, index) => ({
        name: stop.name,
        lat: stop.lat,
        lng: stop.lng,
        stop_order: index + 1,
      })),
      preferences: {
        smoking,
        pets,
        luggage: "MEDIUM",
        ...(note.trim() ? { note: note.trim() } : {}),
      },
    });
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Trajet publié.");
    router.push(`/trajets/${result.data.id}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <UberCard>
        <Stepper current={step} reached={reached} onSelect={goTo} />

        <div className="mt-6 space-y-5">
          {step === 0 ? (
            <>
              <div className="relative">
                <div>
                  <FieldLabel htmlFor="pub-origin">Prise en charge</FieldLabel>
                  <AddressAutocomplete
                    id="pub-origin"
                    placeholder="Lieu de prise en charge"
                    value={origin}
                    onChange={(value) => {
                      setOrigin(value);
                      setItineraryError("");
                    }}
                    variant="uber"
                    locate
                  />
                </div>
                <div className="relative box-content h-9 py-4">
                  <div className="pointer-events-none absolute left-0 top-1/2 z-20 flex h-9 w-14 -translate-y-1/2 items-center justify-center">
                    <button
                      type="button"
                      aria-label="Inverser départ et arrivée"
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
                  <FieldLabel htmlFor="pub-dest">Destination</FieldLabel>
                  <AddressAutocomplete
                    id="pub-dest"
                    placeholder="Destination"
                    value={destination}
                    onChange={(value) => {
                      setDestination(value);
                      setItineraryError("");
                    }}
                    variant="uber"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="when">Date et heure</FieldLabel>
                <UberCalendarField
                  id="when"
                  value={departureTime}
                  onChange={(value) => {
                    setDepartureTime(value);
                    setItineraryError("");
                  }}
                  minDate={new Date()}
                  withTime
                  triggerClassName="uber-date text-base font-medium"
                  aria-label="Date et heure de départ"
                />
              </div>
              <div>
                <FieldLabel htmlFor="add-stop">Arrêts (optionnel)</FieldLabel>
                <AddressAutocomplete
                  key={stops.length}
                  id="add-stop"
                  placeholder="Ajouter un arrêt sur le trajet"
                  value={null}
                  onChange={(point) => {
                    if (point) setStops((current) => [...current, point]);
                  }}
                  variant="uber"
                />
                {stops.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {stops.map((stop, index) => (
                      <li
                        key={`${stop.name}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg bg-[#F6F6F6] px-3 py-2"
                      >
                        <p className="m-0 truncate text-sm font-medium text-black">
                          {index + 1}. {shortPlace(stop.name)}
                        </p>
                        <button
                          type="button"
                          aria-label={`Retirer ${shortPlace(stop.name)}`}
                          onClick={() =>
                            setStops((current) => current.filter((_, item) => item !== index))
                          }
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#545454] hover:bg-white hover:text-black"
                        >
                          <X className="h-4 w-4" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 mb-0 text-[15px] leading-5 text-[#545454]">
                    Les villes où vous pouvez prendre quelqu’un, sans détour inutile.
                  </p>
                )}
              </div>
              <div>
                <FieldLabel htmlFor="trip-note">Note (optionnel)</FieldLabel>
                <textarea
                  id="trip-note"
                  value={note}
                  maxLength={500}
                  rows={4}
                  placeholder="Point de rencontre, bagages ou autre précision utile"
                  onChange={(event) => setNote(event.target.value)}
                  className="min-h-28 w-full resize-y rounded-lg border-0 bg-[#EEEEEE] px-4 py-3 text-base font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black"
                />
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <Counter
                label="Places libres"
                value={totalSeats}
                min={0}
                max={8}
                onChange={setTotalSeats}
              />
              <div>
                <FieldLabel htmlFor="price">Prix par place</FieldLabel>
                <MoneyInput id="price" value={pricePerSeat} onChange={setPricePerSeat} />
              </div>
              <div>
                <FieldLabel>Confort</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSmoking((value) => !value)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-left text-sm font-medium",
                      smoking ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
                    )}
                  >
                    Fumeur accepté
                  </button>
                  <button
                    type="button"
                    onClick={() => setPets((value) => !value)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-left text-sm font-medium",
                      pets ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
                    )}
                  >
                    Animaux acceptés
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F6F6F6] px-4 py-3">
                <div>
                  <p className="m-0 text-sm font-semibold text-black">Accepter des colis</p>
                  <p className="mt-0.5 mb-0 text-[15px] leading-5 text-[#545454]">
                    Le coffre voyage déjà avec vous. Proposez-le sans détour inutile.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={acceptsParcels}
                  onClick={() => setAcceptsParcels((value) => !value)}
                  className={cn(
                    "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                    acceptsParcels ? "bg-black" : "bg-[#D6D6D6]",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                      acceptsParcels && "translate-x-5",
                    )}
                  />
                </button>
              </div>
              {acceptsParcels ? (
                <>
                  <div>
                    <FieldLabel>Taille maximale</FieldLabel>
                    <div className="grid grid-cols-4 gap-2" role="group" aria-label="Taille maximale">
                      {PARCEL_FORMATS.map(({ size, value, icon: Icon }) => {
                        const selected = maxParcelSize === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setMaxParcelSize(value)}
                            className={cn(
                              "inline-flex h-12 items-center justify-center rounded-lg text-sm font-semibold",
                              selected
                                ? "bg-black text-white"
                                : "bg-[#EEEEEE] text-black hover:bg-[#E4E4E4]",
                            )}
                          >
                            <Icon className="h-5 w-5" aria-hidden />
                            <span className="sr-only">{size}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 mb-0 text-sm text-[#545454]">
                      {PARCEL_FORMATS.find((item) => item.value === maxParcelSize)?.label}
                    </p>
                  </div>
                  <div>
                    <FieldLabel htmlFor="parcel-base">Prix de base colis</FieldLabel>
                    <MoneyInput
                      id="parcel-base"
                      value={parcelBasePrice}
                      onChange={setParcelBasePrice}
                    />
                  </div>
                </>
              ) : null}
            </>
          ) : null}
        </div>

        {itineraryError ? (
          <p className="uber-error mt-5" role="alert">
            {itineraryError}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-brand-secondary h-12 px-5"
            >
              Retour
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}
          {step < 2 ? (
            <button type="button" onClick={() => goTo(step + 1)} className="btn-brand h-12 px-6">
              Continuer
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading}
              className="btn-brand h-12 px-6 disabled:opacity-50"
            >
              {loading ? "Publication…" : "Publier le trajet"}
            </button>
          )}
        </div>
      </UberCard>

      <aside className="lg:sticky lg:top-24">
        <UberCard>
          <p className="uber-home-kicker m-0">Votre trajet</p>
          <p className="uber-card-title mt-3">
            {origin || destination
              ? `${shortPlace(origin?.name)} → ${shortPlace(destination?.name)}`
              : "À préciser"}
          </p>
          <dl className="mt-4 space-y-2 text-[15px] leading-5">
            <div className="flex justify-between gap-3">
              <dt className="text-[#545454]">Prise en charge</dt>
              <dd className="m-0 text-right font-medium text-black">
                {departureTime ? formatDateTime(departureTime) : "À choisir"}
              </dd>
            </div>
            {stops.length > 0 ? (
              <div className="flex justify-between gap-3">
                <dt className="text-[#545454]">Arrêts</dt>
                <dd className="m-0 text-right font-medium text-black">
                  {stops.map((stop) => shortPlace(stop.name)).join(" · ")}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-[#545454]">Places</dt>
              <dd className="m-0 font-medium text-black">{totalSeats}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#545454]">Par place</dt>
              <dd className="m-0 font-medium text-black">{formatMoney(pricePerSeat)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[#545454]">Colis</dt>
              <dd className="m-0 text-right font-medium text-black">
                {acceptsParcels
                  ? `${PARCEL_FORMATS.find((item) => item.value === maxParcelSize)?.size ?? ""} · ${formatMoney(parcelBasePrice)}`
                  : "Non acceptés"}
              </dd>
            </div>
            {note.trim() ? (
              <div className="flex justify-between gap-3">
                <dt className="text-[#545454]">Note</dt>
                <dd className="m-0 line-clamp-3 text-right font-medium text-black">
                  {note.trim()}
                </dd>
              </div>
            ) : null}
          </dl>
        </UberCard>
      </aside>
    </div>
  );
}
