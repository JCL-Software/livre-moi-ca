"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { searchPlaces } from "@/lib/geo/nominatim";
import type { GeoPoint } from "@/lib/types";
import { GooeyInput } from "@/components/ui/gooey-input";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  value: GeoPoint | null;
  onChange: (value: GeoPoint | null) => void;
  labelClassName?: string;
  inputClassName?: string;
  variant?: "default" | "gooey";
};

export function AddressAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  labelClassName,
  inputClassName,
  variant = "default",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<GeoPoint[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      const places = await searchPlaces(query);
      setResults(places);
    }, 280);

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleQueryChange(next: string) {
    setQuery(next);
    onChange(null);
    setOpen(next.trim().length >= 2);
  }

  const suggestions =
    open && results.length > 0 ? (
      <ul
        className={cn(
          "absolute z-20 max-h-56 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-md",
          variant === "gooey" ? "top-full mt-2 left-0 min-w-[220px]" : "mt-1",
        )}
      >
        {results.map((place) => (
          <li key={`${place.name}-${place.lat}`}>
            <button
              type="button"
              className="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
              onMouseDown={(event) => event.preventDefault()}
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
    ) : null;

  if (variant === "gooey") {
    return (
      <div ref={containerRef} className="relative w-full min-w-0">
        <GooeyInput
          id={id}
          icon="map-pin"
          appearance="form"
          placeholder={placeholder}
          typewriterText="Commencer à écrire"
          value={query}
          onValueChange={handleQueryChange}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) {
              setOpen(true);
            }
          }}
          clearOnCollapse={false}
          collapsedWidth="100%"
          expandedWidth="100%"
          expandedOffset={36}
          className="w-full"
        />
        {suggestions}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {label ? (
        <label htmlFor={id} className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          size={16}
          animateOnHover
        />
        <Input
          id={id}
          value={query}
          autoComplete="off"
          placeholder={placeholder}
          aria-label={label || placeholder || id}
          className={cn("pl-9", inputClassName)}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) {
              setOpen(true);
            }
          }}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
      </div>
      {suggestions}
    </div>
  );
}
