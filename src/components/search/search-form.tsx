"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, User } from "lucide-react";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
  const [type, setType] = useState<BookingType>(defaultType);
  const [size, setSize] = useState<ParcelSize>("MEDIUM");
  const [seats, setSeats] = useState("1");
  const [luggage, setLuggage] = useState<keyof typeof LUGGAGE_FILTER_LABELS>("MEDIUM");
  const [maxTwoRear, setMaxTwoRear] = useState(false);
  const [intermediateStops, setIntermediateStops] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!origin || !destination) {
      setError("Choisissez une origine et une destination dans la liste.");
      return;
    }
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
            <User className="h-4 w-4" />
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

      <div className={cn(!isNavy && "md:col-span-4")}>
        <AddressAutocomplete
          id="origin"
          label={
            isNavy
              ? "Départ"
              : isPassenger
                ? "Ville de départ"
                : "Le colis part de"
          }
          placeholder={isPassenger ? "Ville de départ…" : "Ville de départ…"}
          value={origin}
          onChange={setOrigin}
          labelClassName={fieldLabelClass}
          inputClassName={isNavy ? navyFieldClass : undefined}
        />
      </div>
      <div className={cn(!isNavy && "md:col-span-4")}>
        <AddressAutocomplete
          id="destination"
          label={
            isNavy
              ? "Destination"
              : isPassenger
                ? "Ville d'arrivée"
                : "Le colis se rend à"
          }
          placeholder={isPassenger ? "Ville d'arrivée…" : "Ville d'arrivée…"}
          value={destination}
          onChange={setDestination}
          labelClassName={fieldLabelClass}
          inputClassName={isNavy ? navyFieldClass : undefined}
        />
      </div>
      <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
        <Label htmlFor="date" className={fieldLabelClass}>
          {isPassenger && !isNavy ? "Date" : "Date souhaitée"}
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setDate(event.target.value)}
          className={isNavy ? navyFieldClass : undefined}
        />
      </div>

      {isPassenger ? (
        <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
          <Label htmlFor="seats" className={fieldLabelClass}>
            Nombre de places
          </Label>
          <Select value={seats} onValueChange={setSeats}>
            <SelectTrigger id="seats" className={isNavy ? navyFieldClass : undefined}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} place{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          <div className={cn("space-y-1.5", !isNavy && "md:col-span-2")}>
            <Label className={fieldLabelClass}>
              {isNavy ? "Format du colis" : "Quel espace votre colis occupe-t-il?"}
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
          <Button type="submit" className="w-full md:w-auto">
            {submitLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
