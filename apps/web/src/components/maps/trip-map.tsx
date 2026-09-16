"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { fitMapToPoints, setLine, useMapboxMap } from "@/components/maps/use-mapbox-map";
import { getWebMapboxToken } from "@/lib/geo/mapbox";

type Props = {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  route?: [number, number][];
  stops?: { lat: number; lng: number; name: string }[];
};

function toLngLat(path: [number, number][]): [number, number][] {
  return path.map(([lat, lng]) => [lng, lat]);
}

export default function TripMap({ origin, destination, route, stops = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, ready } = useMapboxMap(containerRef, {
    center: [origin.lng, origin.lat],
    zoom: 7,
    scrollZoom: false,
  });
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const token = getWebMapboxToken();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const apply = () => {
      const path =
        route && route.length > 1
          ? toLngLat(route)
          : [
              [origin.lng, origin.lat] as [number, number],
              [destination.lng, destination.lat] as [number, number],
            ];
      setLine(map, "lm-trip-route", path, {
        "line-color": "#111111",
        "line-width": 4,
      });

      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      const points = [origin, ...stops, destination];
      for (const point of points) {
        const marker = new mapboxgl.Marker({ color: "#111111" })
          .setLngLat([point.lng, point.lat])
          .setPopup(new mapboxgl.Popup({ offset: 16 }).setText(point.name))
          .addTo(map);
        markersRef.current.push(marker);
      }
      fitMapToPoints(map, points, 32);
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [destination, mapRef, origin, ready, route, stops]);

  if (!token) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-[#F6F6F6] text-sm text-neutral-500 dark:bg-neutral-900">
        Ajoutez `NEXT_PUBLIC_MAPBOX_TOKEN` pour afficher la carte.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full min-h-[280px] w-full overflow-hidden rounded-xl" />
  );
}
