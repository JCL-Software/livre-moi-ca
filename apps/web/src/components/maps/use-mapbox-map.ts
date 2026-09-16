"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getWebMapboxStyle, getWebMapboxToken, isMapboxGlEnabled } from "@/lib/geo/mapbox";
import { applyDefaultMapStyle } from "@/lib/geo/map-style";

const FALLBACK_CENTER: [number, number] = [-73.5673, 45.5017];

export type UseMapboxMapOptions = {
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  scrollZoom?: boolean;
  attribution?: boolean;
  navigation?: boolean;
  /** Si false, n’instancie jamais Mapbox GL (kill switch / mode économie). */
  enabled?: boolean;
  /**
   * N’instancie la carte que lorsqu’elle entre dans le viewport (défaut: true).
   * Évite les Map Loads hors écran et au montage Strict Mode hors vue.
   */
  lazy?: boolean;
};

export function useMapboxMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options?: UseMapboxMapOptions,
) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const enabled = options?.enabled !== false && isMapboxGlEnabled();
  const lazy = options?.lazy !== false;

  useEffect(() => {
    const node = containerRef.current;
    const token = getWebMapboxToken();
    if (!node || !token || !enabled) {
      setReady(false);
      return;
    }

    let cancelled = false;
    let map: mapboxgl.Map | null = null;
    let observer: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const scheduleResize = () => {
      const current = mapRef.current;
      if (!current) return;
      requestAnimationFrame(() => {
        try {
          current.resize();
        } catch {
          /* carte déjà détruite */
        }
      });
    };

    const createMap = () => {
      if (cancelled || mapRef.current || !containerRef.current) return;
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: getWebMapboxStyle(),
        center: options?.center ?? FALLBACK_CENTER,
        zoom: options?.zoom ?? 6,
        attributionControl: options?.attribution !== false,
        interactive: options?.interactive !== false,
        scrollZoom: options?.scrollZoom !== false,
        logoPosition: "bottom-left",
      });
      if (options?.navigation !== false) {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
      }
      const paintBasemap = () => applyDefaultMapStyle(map!);
      if (map.isStyleLoaded()) paintBasemap();
      else map.once("style.load", paintBasemap);
      mapRef.current = map;
      setReady(true);

      // resize() plutôt que réinstancier (orientation / layout).
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(scheduleResize);
        resizeObserver.observe(containerRef.current);
      }
      window.addEventListener("orientationchange", scheduleResize);
      window.addEventListener("resize", scheduleResize);
    };

    if (!lazy) {
      createMap();
    } else if (typeof IntersectionObserver === "undefined") {
      createMap();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            createMap();
            observer?.disconnect();
            observer = null;
          }
        },
        { rootMargin: "80px", threshold: 0.01 },
      );
      observer.observe(node);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("orientationchange", scheduleResize);
      window.removeEventListener("resize", scheduleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setReady(false);
    };
    // Mount once per container / enabled / lazy — updates go through mapRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, enabled, lazy]);

  return { mapRef, ready };
}

export function fitMapToPoints(
  map: mapboxgl.Map,
  points: Array<{ lat: number; lng: number }>,
  padding = 48,
) {
  if (points.length === 0) return;
  if (points.length === 1) {
    map.easeTo({ center: [points[0].lng, points[0].lat], zoom: 11, duration: 600 });
    return;
  }
  const bounds = new mapboxgl.LngLatBounds(
    [points[0].lng, points[0].lat],
    [points[0].lng, points[0].lat],
  );
  for (const point of points) {
    bounds.extend([point.lng, point.lat]);
  }
  map.fitBounds(bounds, { padding, maxZoom: 12, duration: 700 });
}

export function setLine(
  map: mapboxgl.Map,
  id: string,
  coordinates: [number, number][],
  paint: {
    "line-color": string;
    "line-width": number;
    "line-opacity"?: number;
    "line-dasharray"?: number[];
  },
) {
  const data = {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "LineString" as const, coordinates },
  };
  const source = map.getSource(id) as mapboxgl.GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
    return;
  }
  map.addSource(id, { type: "geojson", data });
  map.addLayer({
    id,
    type: "line",
    source: id,
    layout: { "line-cap": "round", "line-join": "round" },
    paint,
  });
}

export function clearLine(map: mapboxgl.Map, id: string) {
  if (map.getLayer(id)) map.removeLayer(id);
  if (map.getSource(id)) map.removeSource(id);
}
