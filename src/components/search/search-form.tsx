"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, User } from "lucide-react";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PARCEL_LABELS } from "@/lib/constants";
import type { BookingType, GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SearchForm({
  compact = false,
  defaultType = "PASSENGER",
}: {
  compact?: boolean;
  defaultType?: BookingType;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [date, setDate] = useState("");
  const [type, setType] = useState<BookingType>(defaultType);
  const [size, setSize] = useState<ParcelSize>("MEDIUM");
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
    if (type === "PARCEL") params.set("size", size);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 md:grid-cols-12 md:p-6 dark:border-slate-700 dark:bg-slate-900",
        compact && "shadow-sm",
      )}
    >
      <div className="flex gap-2 md:col-span-12">
        <Button
          type="button"
          variant={type === "PASSENGER" ? "default" : "outline"}
          onClick={() => setType("PASSENGER")}
        >
          <User className="h-4 w-4" />
          Passager
        </Button>
        <Button
          type="button"
          variant={type === "PARCEL" ? "default" : "outline"}
          onClick={() => setType("PARCEL")}
        >
          <Package className="h-4 w-4" />
          Colis
        </Button>
      </div>

      <div className="md:col-span-4">
        <AddressAutocomplete
          id="origin"
          label="Départ"
          placeholder="Val-d'Or, Amos, Rouyn…"
          value={origin}
          onChange={setOrigin}
        />
      </div>
      <div className="md:col-span-4">
        <AddressAutocomplete
          id="destination"
          label="Arrivée"
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
      {type === "PARCEL" ? (
        <div className="space-y-1.5 md:col-span-2">
          <Label>Taille</Label>
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
      ) : (
        <div className="hidden md:col-span-2 md:block" />
      )}

      {error && <p className="text-sm text-destructive md:col-span-12">{error}</p>}

      <div className="md:col-span-12">
        <Button type="submit" className="w-full md:w-auto">
          Rechercher un trajet
        </Button>
      </div>
    </form>
  );
}
