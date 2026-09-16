"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { fitMapToPoints, setLine, useMapboxMap } from "@/components/maps/use-mapbox-map";
import { CORRIDOR_CITIES } from "@/lib/constants";
import {
  buildRoutePoints,
  getRouteCityNames,
  type PopularRoute,
} from "@/lib/carpool-routes";
import { getWebMapboxToken } from "@/lib/geo/mapbox";

type CorridorRoutesMapProps = {
  routes: readonly PopularRoute[];
  selectedIndex: number | null;
  onSelectRoute: (index: number) => void;
};

export default function CorridorRoutesMap({
  routes,
  selectedIndex,
  onSelectRoute,
}: CorridorRoutesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, ready } = useMapboxMap(containerRef, {
    center: [-76.5, 47.5],
    zoom: 6,
    scrollZoom: false,
  });
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const token = getWebMapboxToken();
  const selectedRoute = selectedIndex !== null ? routes[selectedIndex] : null;

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const clickHandlers: Array<{ id: string; handler: () => void }> = [];

    const apply = () => {
      routes.forEach((route, index) => {
        const points = buildRoutePoints(route);
        if (points.length < 2) return;
        const isActive = selectedIndex === index;
        const layerId = `lm-corridor-${index}`;
        setLine(
          map,
          layerId,
          points.map(([lat, lng]) => [lng, lat] as [number, number]),
          {
            "line-color": isActive ? "#000000" : "#c6c6c6",
            "line-width": isActive ? 5 : 2,
            "line-opacity": isActive ? 1 : 0.45,
            "line-dasharray": isActive ? [1, 0] : [1.2, 1.6],
          },
        );
        if (map.getLayer(layerId)) {
          const handler = () => onSelectRoute(index);
          map.on("click", layerId, handler);
          clickHandlers.push({ id: layerId, handler });
        }
      });

      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      const activeCityNames = selectedRoute ? new Set(getRouteCityNames(selectedRoute)) : null;
      for (const city of CORRIDOR_CITIES) {
        const isActive = activeCityNames?.has(city.name) ?? false;
        const el = document.createElement("span");
        el.style.cssText = `display:block;width:${isActive ? 14 : 10}px;height:${isActive ? 14 : 10}px;border-radius:9999px;background:#000;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)`;
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([city.lng, city.lat])
          .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(city.name))
          .addTo(map);
        markersRef.current.push(marker);
      }

      if (selectedRoute) {
        const routePoints = buildRoutePoints(selectedRoute).map(([lat, lng]) => ({ lat, lng }));
        if (routePoints.length > 0) {
          fitMapToPoints(map, routePoints, 48);
          return;
        }
      }
      fitMapToPoints(
        map,
        CORRIDOR_CITIES.map((city) => ({ lat: city.lat, lng: city.lng })),
        32,
      );
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);

    return () => {
      map.off("load", apply);
      for (const { id, handler } of clickHandlers) {
        map.off("click", id, handler);
      }
    };
  }, [mapRef, onSelectRoute, ready, routes, selectedIndex, selectedRoute]);

  if (!token) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-[#F6F6F6] text-sm text-neutral-500 dark:bg-neutral-900">
        Ajoutez `NEXT_PUBLIC_MAPBOX_TOKEN` pour afficher la carte.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full min-h-[320px] w-full overflow-hidden rounded-2xl" />
  );
}
