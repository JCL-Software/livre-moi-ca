"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { retrievePlace, reverseGeocode, searchPlaces } from "@/lib/geo/places";
import { parseAddressName } from "@livre-moi/shared/geo";
import {
  MAP_SEARCH_DEBOUNCE_MS,
  MAP_SEARCH_MIN_CHARS,
} from "@livre-moi/shared/constants";
import type { GeoPoint, PlaceSuggestion } from "@/lib/types";
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
  variant?: "default" | "gooey" | "uber";
  locate?: boolean;
  barRef?: Ref<HTMLDivElement>;
  onOpenChange?: (open: boolean) => void;
  onFocus?: () => void;
};

/** Cache suggest côté navigateur (session onglet). */
const clientSuggestCache = new Map<string, PlaceSuggestion[]>();

function cacheKey(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function AddressAutocomplete({
  id,
  label,
  placeholder,
  value,
  onChange,
  labelClassName,
  inputClassName,
  variant = "default",
  locate = false,
  barRef,
  onOpenChange,
  onFocus,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [locating, setLocating] = useState(false);
  const sessionTokenRef = useRef("");
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const selectedName = value?.name ?? "";
  const isSelectedQuery = Boolean(selectedName) && query === selectedName;

  useEffect(() => {
    sessionTokenRef.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }, []);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    if (isSelectedQuery) {
      setResults([]);
      setOpen(false);
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < MAP_SEARCH_MIN_CHARS) {
      setResults([]);
      return;
    }

    const key = cacheKey(trimmed);
    const cached = clientSuggestCache.get(key);
    if (cached) {
      setResults(cached);
      setOpen(cached.length > 0);
      return;
    }

    const handle = setTimeout(async () => {
      const places = await searchPlaces(trimmed, sessionTokenRef.current);
      clientSuggestCache.set(key, places);
      setResults(places);
      setOpen(places.length > 0);
    }, MAP_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, isSelectedQuery]);

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
    setOpen(next.trim().length >= MAP_SEARCH_MIN_CHARS);
  }

  async function handleSelect(place: PlaceSuggestion) {
    let selected: GeoPoint | null = null;
    if (place.lat != null && place.lng != null) {
      selected = { name: place.name, lat: place.lat, lng: place.lng };
    } else if (place.mapboxId) {
      selected = await retrievePlace(place.mapboxId, sessionTokenRef.current, query);
      sessionTokenRef.current =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    if (!selected) return;
    onChange({ ...parseAddressName(selected.name), ...selected });
    setQuery(selected.name);
    setResults([]);
    setOpen(false);
  }

  function handleFocus() {
    onFocus?.();
    if (isSelectedQuery) return;
    if (query.trim().length >= MAP_SEARCH_MIN_CHARS && results.length > 0) {
      setOpen(true);
    }
  }

  async function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const point = await reverseGeocode(
            position.coords.latitude,
            position.coords.longitude,
          );
          if (point) {
            onChange(point);
            setQuery(point.name);
            setResults([]);
            setOpen(false);
          }
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  const locateButton = locate ? (
    <button
      type="button"
      className="uber-locate"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleLocate();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      disabled={locating}
      aria-label="Indiquer automatiquement mon emplacement"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M10.5 13.5.5 11 21 3l-8 20.5-2.5-10Z" fill="currentColor" />
      </svg>
    </button>
  ) : null;

  const suggestions =
    open && results.length > 0 ? (
      <ul
        className={cn(
          "max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-md dark:border-white/10 dark:bg-neutral-950",
          variant === "gooey" || variant === "uber" ? "relative z-50 mt-2" : "absolute z-50 mt-1",
        )}
      >
        {results.map((place, index) => (
          <li key={place.mapboxId ?? `${place.name}-${place.lat}-${place.lng}-${index}`}>
            <button
              type="button"
              className="flex w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(place)}
            >
              {place.name}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  if (variant === "uber") {
    return (
      <div
        ref={containerRef}
        className={cn("relative w-full min-w-0", open && "z-50")}
      >
        {label ? (
          <label htmlFor={id} className={cn("mb-1 block text-sm font-medium", labelClassName)}>
            {label}
          </label>
        ) : null}
        <GooeyInput
          id={id}
          icon="map-pin"
          appearance="uber"
          placeholder={placeholder}
          typewriterText="Commencer à écrire"
          value={query}
          onValueChange={handleQueryChange}
          onFocus={handleFocus}
          clearOnCollapse={false}
          collapsedWidth="100%"
          expandedWidth="100%"
          expandedOffset={64}
          className="w-full"
          endAction={locateButton}
          barRef={barRef}
          onOpenChange={onOpenChange}
        />
        {suggestions}
      </div>
    );
  }

  if (variant === "gooey") {
    return (
      <div
        ref={containerRef}
        className={cn("relative w-full min-w-0 space-y-1.5", open && "z-50")}
      >
        {label ? (
          <label htmlFor={id} className={cn("text-sm font-medium", labelClassName)}>
            {label}
          </label>
        ) : null}
        <GooeyInput
          id={id}
          icon="map-pin"
          appearance="form"
          placeholder={placeholder}
          typewriterText="Commencer à écrire"
          value={query}
          onValueChange={handleQueryChange}
          onFocus={handleFocus}
          clearOnCollapse={false}
          collapsedWidth="100%"
          expandedWidth="100%"
          expandedOffset={36}
          className="w-full"
          endAction={locateButton}
        />
        {suggestions}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative space-y-1.5", open && "z-50")}
    >
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
          className={cn("pl-9", locate && "pr-11", inputClassName)}
          onFocus={handleFocus}
          onChange={(event) => handleQueryChange(event.target.value)}
        />
        {locateButton ? (
          <div className="absolute top-1/2 right-3 z-20 -translate-y-1/2">
            {locateButton}
          </div>
        ) : null}
      </div>
      {suggestions}
    </div>
  );
}
