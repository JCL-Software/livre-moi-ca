"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { startOfDay } from "date-fns";
import { ArrowUpDown, Minus, Plus } from "lucide-react";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { UberCalendarField } from "@/components/baseweb/uber-calendar";
import { UberCard } from "@/components/baseweb/uber-ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LUGGAGE_FILTER_LABELS } from "@/lib/constants";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { BookingType, GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

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

export function SearchForm({
  compact = false,
  defaultType = "PARCEL",
  defaultOrigin = null,
  defaultDestination = null,
  defaultDate = "",
  defaultSeats = "1",
  defaultSize = "MEDIUM",
  showTypeToggle = true,
  passengerExtras = false,
  submitLabel = "Rechercher",
  appearance = "default",
}: {
  compact?: boolean;
  defaultType?: BookingType;
  defaultOrigin?: GeoPoint | null;
  defaultDestination?: GeoPoint | null;
  defaultDate?: string;
  defaultSeats?: string;
  defaultSize?: ParcelSize;
  showTypeToggle?: boolean;
  passengerExtras?: boolean;
  submitLabel?: string;
  appearance?: "default" | "navy";
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState<GeoPoint | null>(defaultOrigin);
  const [destination, setDestination] = useState<GeoPoint | null>(defaultDestination);
  const [date, setDate] = useState(defaultDate);
  const [type, setType] = useState<BookingType>(defaultType);
  const [size, setSize] = useState<ParcelSize>(defaultSize);
  const [seats, setSeats] = useState(Number(defaultSeats) || 1);
  const [luggage, setLuggage] = useState<keyof typeof LUGGAGE_FILTER_LABELS>("MEDIUM");
  const [maxTwoRear, setMaxTwoRear] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const originBarRef = useRef<HTMLDivElement>(null);
  const destBarRef = useRef<HTMLDivElement>(null);
  const [swapTop, setSwapTop] = useState<number | null>(null);
  const today = startOfDay(new Date());
  const isPassenger = type === "PASSENGER";
  const isNavy = appearance === "navy";

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const first = originBarRef.current;
    const second = destBarRef.current;
    if (!wrap || !first || !second) return;

    const update = () => {
      const wr = wrap.getBoundingClientRect();
      const a = first.getBoundingClientRect();
      const b = second.getBoundingClientRect();
      setSwapTop((a.top + a.bottom + b.top + b.bottom) / 4 - wr.top);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(wrap);
    observer.observe(first);
    observer.observe(second);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [origin, destination, appearance]);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    if (defaultDate) {
      setDate(defaultDate.slice(0, 10));
      return;
    }
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
    setDate(local.toISOString().slice(0, 10));
  }, [defaultDate]);

  useEffect(() => {
    if (origin || destination) setError(null);
  }, [origin, destination]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Choisissez une origine et une destination dans la liste.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      origin: origin.name,
      olat: String(origin.lat),
      olng: String(origin.lng),
      dest: destination.name,
      dlat: String(destination.lat),
      dlng: String(destination.lng),
      date: date.slice(0, 10),
      type,
    });
    if (type === "PARCEL") {
      params.set("size", size);
    } else {
      params.set("seats", String(seats));
      if (passengerExtras) {
        params.set("luggage", luggage);
        if (maxTwoRear) params.set("maxRear", "2");
        if (intermediateStops) params.set("stops", "1");
      }
    }
    router.push(`/recherche?${params.toString()}`);
  }

  const fields = (
    <form onSubmit={onSubmit} className="space-y-4">
      {showTypeToggle ? (
        <div className="flex gap-2" role="group" aria-label="Type de recherche">
          <button
            type="button"
            onClick={() => setType("PASSENGER")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold",
              isPassenger ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
            )}
          >
            Passager
          </button>
          <button
            type="button"
            onClick={() => setType("PARCEL")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold",
              !isPassenger ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
            )}
          >
            Colis
          </button>
        </div>
      ) : null}

      <div className="relative" ref={wrapRef}>
        <div>
          {isNavy ? <FieldLabel htmlFor="origin">Prise en charge</FieldLabel> : null}
          <AddressAutocomplete
            id="origin"
            placeholder="Lieu de prise en charge"
            value={origin}
            onChange={setOrigin}
            variant="uber"
            locate
            barRef={originBarRef}
          />
        </div>
        <div className="box-content h-9 py-4" aria-hidden="true" />
        <div>
          {isNavy ? <FieldLabel htmlFor="destination">Destination</FieldLabel> : null}
          <AddressAutocomplete
            id="destination"
            placeholder="Destination"
            value={destination}
            onChange={setDestination}
            variant="uber"
            barRef={destBarRef}
          />
        </div>
        {swapTop != null ? (
          <div
            className="pointer-events-none absolute left-0 z-20 flex h-9 w-14 -translate-y-1/2 items-center justify-center"
            style={{ top: swapTop }}
          >
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
        ) : null}
      </div>

      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <div>
          {isNavy ? <FieldLabel htmlFor="date">Date</FieldLabel> : null}
          <UberCalendarField
            id="date"
            value={date}
            onChange={setDate}
            minDate={today}
            withTime={false}
            triggerClassName="uber-date text-base font-medium"
            aria-label="Date"
          />
        </div>

        {isPassenger ? (
          <div>
            {isNavy ? <FieldLabel>Places</FieldLabel> : null}
            <div className="flex h-14 items-center justify-between rounded-lg bg-[#EEEEEE] px-3">
              <button
                type="button"
                aria-label="Diminuer"
                disabled={seats <= 1}
                onClick={() => setSeats((value) => value - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
              >
                <Minus className="h-4 w-4" aria-hidden />
              </button>
              <p className="m-0 text-base font-semibold text-black">
                {seats} place{seats > 1 ? "s" : ""}
              </p>
              <button
                type="button"
                aria-label="Augmenter"
                disabled={seats >= 4}
                onClick={() => setSeats((value) => value + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
              >
                <Plus className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {!isPassenger ? (
        <div>
          <FieldLabel>Format du colis</FieldLabel>
          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Format du colis">
            {PARCEL_FORMATS.map(({ size: code, value, icon: Icon }) => {
              const selected = size === value;
              return (
                <button
                  key={value}
                  type="button"
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
                  <span className="sr-only">{code}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 mb-0 text-[15px] leading-5 text-[#545454]">
            {PARCEL_FORMATS.find((item) => item.value === size)?.label}
          </p>
        </div>
      ) : null}

      {isPassenger && passengerExtras ? (
        <>
          <div>
            <Label className="uber-home-kicker mb-1.5 block">Bagages</Label>
            <Select
              value={luggage}
              onValueChange={(value) =>
                setLuggage(value as keyof typeof LUGGAGE_FILTER_LABELS)
              }
            >
              <SelectTrigger className="h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 text-base font-medium shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LUGGAGE_FILTER_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#545454]">
              <Checkbox
                checked={maxTwoRear}
                onCheckedChange={(checked) => setMaxTwoRear(checked === true)}
              />
              Max. 2 personnes à l&apos;arrière
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#545454]">
              <Checkbox
                checked={intermediateStops}
                onCheckedChange={(checked) => setIntermediateStops(checked === true)}
              />
              Arrêts possibles
            </label>
          </div>
        </>
      ) : null}

      {error ? (
        <p className="uber-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="btn-brand h-12 w-full sm:w-auto sm:px-6">
        {submitLabel}
      </button>
    </form>
  );

  if (isNavy) return fields;
  return <UberCard>{fields}</UberCard>;
}
