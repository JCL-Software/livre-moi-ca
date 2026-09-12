"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format, isSameDay, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Package } from "lucide-react";
import { User } from "@/components/animate-ui/icons/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu";
import { DropdownMenuContent as DropdownMenuContentPrimitive } from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Calendar } from "@/components/ui/calendar";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LUGGAGE_FILTER_LABELS, PARCEL_LABELS } from "@/lib/constants";
import type { BookingType, GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

const navyFieldClass =
  "h-12 w-full rounded-lg border-transparent bg-white text-black shadow-none placeholder:text-neutral-400 transition-[border-color,box-shadow] duration-200 focus-visible:border-black focus-visible:ring-2 focus-visible:ring-black/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 dark:focus-visible:border-white";

const menuTriggerClass =
  "flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

function formatDateTriggerLabel(iso: string) {
  if (!iso) return "Date";
  const selected = parseISO(iso);
  const today = startOfDay(new Date());
  if (isSameDay(selected, today)) return "Aujourd'hui";
  if (isSameDay(selected, addDays(today, 1))) return "Demain";
  return format(selected, "d MMM yyyy", { locale: fr });
}

export function SearchForm({
  compact = false,
  defaultType = "PARCEL",
  showTypeToggle = true,
  passengerExtras = false,
  submitLabel = "Rechercher un trajet",
  appearance = "default",
}: {
  compact?: boolean;
  defaultType?: BookingType;
  showTypeToggle?: boolean;
  passengerExtras?: boolean;
  submitLabel?: string;
  appearance?: "default" | "navy";
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [date, setDate] = useState("");
  const [dateOpen, setDateOpen] = useState(false);
  const [type, setType] = useState<BookingType>(defaultType);
  const [size, setSize] = useState<ParcelSize>("MEDIUM");
  const [seats, setSeats] = useState("1");
  const [luggage, setLuggage] = useState<keyof typeof LUGGAGE_FILTER_LABELS>("MEDIUM");
  const [maxTwoRear, setMaxTwoRear] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = startOfDay(new Date());
  const selectedDate = date ? parseISO(date) : undefined;

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    if (origin || destination) {
      setError(null);
    }
  }, [origin, destination]);

  useEffect(() => {
    if (!error) return;

    function clearError() {
      setError(null);
    }

    document.addEventListener("pointerdown", clearError);
    return () => document.removeEventListener("pointerdown", clearError);
  }, [error]);

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
      date,
      type,
    });
    if (type === "PARCEL") {
      params.set("size", size);
    } else {
      params.set("seats", seats);
      if (passengerExtras) {
        params.set("luggage", luggage);
        if (maxTwoRear) params.set("maxRear", "2");
        if (intermediateStops) params.set("stops", "1");
      }
    }
    router.push(`/recherche?${params.toString()}`);
  }

  const isPassenger = type === "PASSENGER";
  const isNavy = appearance === "navy";
  const useGooeyPlaces = isNavy || isPassenger;
  const fieldLabelClass = isNavy ? "text-sm font-medium text-black dark:text-white" : undefined;

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "grid gap-4",
        isNavy
          ? "grid-cols-1"
          : "rounded-xl border border-[#E8E8E8] bg-white p-4 md:grid-cols-12 md:p-6 dark:border-white/10 dark:bg-neutral-950",
        compact && !isNavy && "shadow-sm",
      )}
    >
      {showTypeToggle && (
        <div className="flex gap-2 md:col-span-12">
          <Button
            type="button"
            variant={isPassenger ? "default" : "outline"}
            onClick={() => setType("PASSENGER")}
          >
            <User className="h-4 w-4" size={16} animateOnHover />
            Passager
          </Button>
          <Button
            type="button"
            variant={!isPassenger ? "default" : "outline"}
            onClick={() => setType("PARCEL")}
          >
            <Package className="h-4 w-4" />
            Colis
          </Button>
        </div>
      )}

      <div
        className={cn(
          !isNavy &&
            (isPassenger
              ? "md:col-span-3"
              : "md:col-span-4"),
        )}
      >
        <AddressAutocomplete
          id="origin"
          label={
            isNavy
              ? "Départ"
              : isPassenger
                ? undefined
                : "Le colis part de"
          }
          placeholder={isPassenger ? "Lieu de départ…" : "Ville de départ…"}
          value={origin}
          onChange={setOrigin}
          labelClassName={fieldLabelClass}
          inputClassName={isNavy && !useGooeyPlaces ? navyFieldClass : undefined}
          variant={useGooeyPlaces ? "gooey" : "default"}
        />
      </div>
      <div
        className={cn(
          !isNavy &&
            (isPassenger
              ? "md:col-span-3"
              : "md:col-span-4"),
        )}
      >
        <AddressAutocomplete
          id="destination"
          label={
            isNavy
              ? "Destination"
              : isPassenger
                ? undefined
                : "Le colis se rend à"
          }
          placeholder={isPassenger ? "Destination…" : "Ville d'arrivée…"}
          value={destination}
          onChange={setDestination}
          labelClassName={fieldLabelClass}
          inputClassName={isNavy && !useGooeyPlaces ? navyFieldClass : undefined}
          variant={useGooeyPlaces ? "gooey" : "default"}
        />
      </div>
      <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
        {!useGooeyPlaces || isNavy ? (
          <Label htmlFor="date" className={fieldLabelClass}>
            Date souhaitée
          </Label>
        ) : null}
        <DropdownMenu open={dateOpen} onOpenChange={setDateOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              id="date"
              aria-label="Date"
              className={cn(menuTriggerClass, isNavy && navyFieldClass)}
            >
              <span className="truncate">{formatDateTriggerLabel(date)}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContentPrimitive
            align="start"
            sideOffset={4}
            className="z-50 w-auto min-w-0 overflow-hidden rounded-md border border-[#E8E8E8] bg-white p-0 text-black shadow-md outline-none dark:border-white/10 dark:bg-neutral-950 dark:text-white"
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            <Calendar
              mode="single"
              locale={fr}
              selected={selectedDate}
              defaultMonth={selectedDate ?? today}
              disabled={{ before: today }}
              className="bg-transparent"
              onSelect={(day) => {
                if (!day) return;
                setDate(format(day, "yyyy-MM-dd"));
                setDateOpen(false);
              }}
            />
          </DropdownMenuContentPrimitive>
        </DropdownMenu>
      </div>

      {isPassenger ? (
        <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
          {isNavy ? (
            <Label htmlFor="seats" className={fieldLabelClass}>
              Nombre de places
            </Label>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                id="seats"
                aria-label="Nombre de places"
                className={cn(menuTriggerClass, isNavy && navyFieldClass)}
              >
                <span>
                  {seats} place{seats === "1" ? "" : "s"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={4}
              className="min-w-[8rem] border-[#E8E8E8] bg-white text-black dark:border-white/10 dark:bg-neutral-950 dark:text-white"
            >
              <DropdownMenuRadioGroup value={seats} onValueChange={setSeats}>
                {[1, 2, 3, 4].map((n) => (
                  <DropdownMenuRadioItem key={n} value={String(n)}>
                    {n} place{n > 1 ? "s" : ""}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
            <Label className={fieldLabelClass}>
              {isNavy ? "Format du colis" : "Quel espace votre colis occupe-t-il ?"}
            </Label>
            <Select value={size} onValueChange={(value) => setSize(value as ParcelSize)}>
              <SelectTrigger className={isNavy ? cn(navyFieldClass, "w-full data-[size=default]:h-11") : undefined}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PARCEL_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!isNavy && (
            <p className="text-xs leading-relaxed text-slate-500 md:col-span-12 dark:text-slate-400">
              En cas de doute, choisissez le format supérieur. Le conducteur pourra
              confirmer l&apos;espace disponible avant d&apos;accepter.
            </p>
          )}
        </>
      )}

      {isPassenger && passengerExtras && (
        <>
          <div className="space-y-1.5 md:col-span-4">
            <Label>Bagages autorisés</Label>
            <Select
              value={luggage}
              onValueChange={(value) =>
                setLuggage(value as keyof typeof LUGGAGE_FILTER_LABELS)
              }
            >
              <SelectTrigger>
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
          <div className="flex flex-col justify-end gap-3 md:col-span-8 md:flex-row md:items-center">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <Checkbox
                checked={maxTwoRear}
                onCheckedChange={(checked) => setMaxTwoRear(checked === true)}
              />
              Max. 2 personnes à l&apos;arrière
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <Checkbox
                checked={intermediateStops}
                onCheckedChange={(checked) => setIntermediateStops(checked === true)}
              />
              Arrêts intermédiaires possibles
            </label>
          </div>
        </>
      )}

      {error && (
        <p className={cn("text-sm text-destructive", !isNavy && "md:col-span-12")}>
          {error}
        </p>
      )}

      <div className={cn(!isNavy && "md:col-span-12")}>
        {isNavy ? (
          <MovingBorderButton
            type="submit"
            borderRadius="0.5rem"
            duration={6000}
            containerClassName="h-12 w-full p-[1px] text-base"
            borderClassName="h-16 w-16 bg-[radial-gradient(#000000_40%,transparent_60%)] opacity-40"
            className="border-black/10 bg-black font-medium text-white hover:bg-neutral-800 dark:border-white/10 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            {submitLabel}
          </MovingBorderButton>
        ) : (
          <HoverBorderGradient
            as="button"
            type="submit"
            duration={1}
            containerClassName="h-8 w-full flex-row gap-0 rounded-lg border-transparent bg-transparent p-px hover:bg-transparent md:w-auto dark:bg-transparent"
            className="flex h-[calc(100%-2px)] items-center justify-center rounded-[inherit] bg-black px-2.5 py-0 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {submitLabel}
          </HoverBorderGradient>
        )}
      </div>
    </form>
  );
}
