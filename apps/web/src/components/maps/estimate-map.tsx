"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { clearLine, fitMapToPoints, setLine, useMapboxMap } from "@/components/maps/use-mapbox-map";
import { StaticMapImage } from "@/components/maps/static-map-image";
import { getWebMapboxToken, isMapboxGlEnabled } from "@/lib/geo/mapbox";
import type { GeoPoint } from "@/lib/types";

const FALLBACK_CENTER: [number, number] = [45.5017, -73.5673];
const USER_ZOOM = 13;
const APPROX_GRID_DEG = 0.004;

type Props = {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  activeRoute?: [number, number][];
  alternateRoute?: [number, number][];
  /**
   * Sur les pages marketing / hero : n’ouvre Mapbox GL que lorsqu’un point
   * est saisi. Sinon affiche une image Static (beaucoup moins de Map Loads).
   */
  deferUntilPins?: boolean;
};

function snapApproximate(lat: number, lng: number): [number, number] {
  return [
    Math.round(lat / APPROX_GRID_DEG) * APPROX_GRID_DEG,
    Math.round(lng / APPROX_GRID_DEG) * APPROX_GRID_DEG,
  ];
}

function toLngLat(path: [number, number][]): [number, number][] {
  return path.map(([lat, lng]) => [lng, lat]);
}

function upsertMarker(
  map: mapboxgl.Map,
  bucket: Map<string, mapboxgl.Marker>,
  id: string,
  lngLat: [number, number],
  className: string,
  label: string,
) {
  const existing = bucket.get(id);
  if (existing) {
    existing.setLngLat(lngLat);
    return;
  }
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.setAttribute("aria-label", label);
  const marker = new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
  bucket.set(id, marker);
}

export default function EstimateMap({
  origin,
  destination,
  activeRoute,
  alternateRoute,
  deferUntilPins = false,
}: Props) {
  const hasPins = Boolean(origin || destination);
  const useInteractive =
    isMapboxGlEnabled() && (!deferUntilPins || hasPins);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, ready } = useMapboxMap(containerRef, {
    center: [FALLBACK_CENTER[1], FALLBACK_CENTER[0]],
    zoom: 11,
    enabled: useInteractive,
  });
  const markersRef = useRef(new Map<string, mapboxgl.Marker>());
  const [locating, setLocating] = useState(false);
  const token = getWebMapboxToken();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const apply = () => {
      if (alternateRoute && alternateRoute.length > 1) {
        setLine(map, "lm-alt-route", toLngLat(alternateRoute), {
          "line-color": "#9CA3AF",
          "line-width": 4,
          "line-opacity": 0.45,
        });
      } else {
        clearLine(map, "lm-alt-route");
      }
      if (activeRoute && activeRoute.length > 1) {
        setLine(map, "lm-active-route", toLngLat(activeRoute), {
          "line-color": "#111111",
          "line-width": 5,
          "line-opacity": 0.9,
        });
      } else {
        clearLine(map, "lm-active-route");
      }
      if (origin) {
        upsertMarker(
          map,
          markersRef.current,
          "origin",
          [origin.lng, origin.lat],
          "lm-map-pin lm-map-pin-origin",
          origin.name,
        );
      } else {
        markersRef.current.get("origin")?.remove();
        markersRef.current.delete("origin");
      }
      if (destination) {
        upsertMarker(
          map,
          markersRef.current,
          "destination",
          [destination.lng, destination.lat],
          "lm-map-pin lm-map-pin-dest",
          destination.name,
        );
      } else {
        markersRef.current.get("destination")?.remove();
        markersRef.current.delete("destination");
      }

      const fitPoints = [
        ...(activeRoute && activeRoute.length > 1
          ? activeRoute.map(([lat, lng]) => ({ lat, lng }))
          : []),
        ...(origin ? [origin] : []),
        ...(destination ? [destination] : []),
      ];
      if (fitPoints.length > 0) fitMapToPoints(map, fitPoints, 56);
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [activeRoute, alternateRoute, destination, mapRef, origin, ready]);

  function locateMe() {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const [lat, lng] = snapApproximate(
          position.coords.latitude,
          position.coords.longitude,
        );
        map.easeTo({ center: [lng, lat], zoom: USER_ZOOM, duration: 700 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  if (!token) {
    return (
      <div className="flex h-full min-h-[360px] items-center justify-center bg-[#F6F6F6] px-6 text-center text-sm text-neutral-500 dark:bg-neutral-900">
        Ajoutez `NEXT_PUBLIC_MAPBOX_TOKEN` pour afficher la carte.
      </div>
    );
  }

  if (!useInteractive) {
    return (
      <div className="estimate-map relative h-full w-full min-h-[360px] overflow-hidden bg-[#e8eef4]">
        <StaticMapImage
          className="absolute inset-0"
          width={640}
          height={900}
          zoom={10}
          alt="Carte de la région de Montréal"
        />
      </div>
    );
  }

  return (
    <div className="estimate-map relative h-full w-full">
      <div ref={containerRef} className="h-full min-h-[360px] w-full" />
      <button
        type="button"
        className="estimate-map-locate"
        onClick={locateMe}
        disabled={locating}
        aria-label="Centrer sur ma position"
      >
        <LocateFixed className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
