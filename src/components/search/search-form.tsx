"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, User } from "lucide-react";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Button } from "@/components/ui/button";
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

export function SearchForm({
  compact = false,
  defaultType = "PARCEL",
  showTypeToggle = true,
  passengerExtras = false,
  submitLabel = "Rechercher un trajet",
}: {
  compact?: boolean;
  defaultType?: BookingType;
  showTypeToggle?: boolean;
  passengerExtras?: boolean;
  submitLabel?: string;
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

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 md:grid-cols-12 md:p-6 dark:border-slate-700 dark:bg-slate-900",
        compact && "shadow-sm",
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

      <div className="md:col-span-4">
        <AddressAutocomplete
          id="origin"
          label={isPassenger ? "Ville de départ" : "Ville de départ"}
          placeholder="Val-d'Or, Amos, Rouyn…"
          value={origin}
          onChange={setOrigin}
        />
      </div>
      <div className="md:col-span-4">
        <AddressAutocomplete
          id="destination"
          label={isPassenger ? "Ville d'arrivée" : "Ville de destination"}
          placeholder="Montréal, Gatineau…"
          value={destination}
          onChange={setDestination}
        />
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      {isPassenger ? (
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="seats">Nombre de places</Label>
          <Select value={seats} onValueChange={setSeats}>
            <SelectTrigger id="seats">
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
        <div className="space-y-1.5 md:col-span-2">
          <Label>Format du colis</Label>
          <Select value={size} onValueChange={(value) => setSize(value as ParcelSize)}>
            <SelectTrigger>
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

      {error && <p className="text-sm text-destructive md:col-span-12">{error}</p>}

      <div className="md:col-span-12">
        <Button type="submit" className="w-full md:w-auto">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
