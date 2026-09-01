"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { searchPlaces } from "@/lib/geo/nominatim";
import { CORRIDOR_CITIES } from "@/lib/constants";
import type { GeoPoint } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  placeholder?: string;
  value: GeoPoint | null;
  onChange: (value: GeoPoint | null) => void;
};

export function AddressAutocomplete({ id, label, placeholder, value, onChange }: Props) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<GeoPoint[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults(
          CORRIDOR_CITIES.filter((city) =>
            city.name.toLowerCase().includes(query.toLowerCase()),
          ).map((city) => ({ name: city.name, lat: city.lat, lng: city.lng })),
        );
        return;
      }
      const places = await searchPlaces(query);
      setResults(places);
    }, 280);

    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="relative space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={query}
          autoComplete="off"
          placeholder={placeholder}
          className="pl-9"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange(null);
            setOpen(true);
          }}
        />
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-md">
          {results.map((place) => (
            <li key={`${place.name}-${place.lat}`}>
              <button
                type="button"
                className={cn(
                  "flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent",
                )}
                onClick={() => {
                  onChange(place);
                  setQuery(place.name);
                  setOpen(false);
                }}
              >
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
