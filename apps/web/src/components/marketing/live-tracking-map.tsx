"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { setLine, useMapboxMap } from "@/components/maps/use-mapbox-map";
import { getWebMapboxToken } from "@/lib/geo/mapbox";
import {
  LIVE_TRACKING_ROUTES,
  MONTREAL_CENTER,
} from "@/lib/live-tracking-routes";

function toLngLat(path: [number, number][]): [number, number][] {
  return path.map(([lat, lng]) => [lng, lat]);
}

function cumulativeDistances(points: [number, number][]) {
  const distances = [0];
  for (let index = 1; index < points.length; index += 1) {
    const [latA, lngA] = points[index - 1];
    const [latB, lngB] = points[index];
    distances.push(distances[index - 1] + Math.hypot(latB - latA, lngB - lngA));
  }
  return distances;
}

function sampleAlongRoute(
  points: [number, number][],
  distances: number[],
  progress: number,
) {
  const total = distances[distances.length - 1] || 1;
  const target = Math.min(1, Math.max(0, progress)) * total;
  let index = 1;
  while (index < distances.length && distances[index] < target) {
    index += 1;
  }
  const previous = points[index - 1];
  const next = points[index] ?? previous;
  const from =
    next[0] === previous[0] && next[1] === previous[1]
      ? (points[Math.max(0, index - 2)] ?? previous)
      : previous;
  const span = distances[index] - distances[index - 1] || 1;
  const mix = (target - distances[index - 1]) / span;
  const heading = (Math.atan2(next[1] - from[1], next[0] - from[0]) * 180) / Math.PI;

  return {
    position: [
      previous[0] + (next[0] - previous[0]) * mix,
      previous[1] + (next[1] - previous[1]) * mix,
    ] as [number, number],
    heading,
  };
}

type LiveTrackingMapProps = {
  activeRouteId: string;
};

export default function LiveTrackingMap({ activeRouteId }: LiveTrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, ready } = useMapboxMap(containerRef, {
    center: [MONTREAL_CENTER[1], MONTREAL_CENTER[0]],
    zoom: 10,
    scrollZoom: false,
    navigation: false,
  });
  const driverRef = useRef<mapboxgl.Marker | null>(null);
  const token = getWebMapboxToken();
  const activeRoute =
    LIVE_TRACKING_ROUTES.find((route) => route.id === activeRouteId) ?? LIVE_TRACKING_ROUTES[0];
  const distances = useMemo(
    () => cumulativeDistances(activeRoute.points),
    [activeRoute.points],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const apply = () => {
      for (const route of LIVE_TRACKING_ROUTES) {
        const isActive = route.id === activeRoute.id;
        setLine(map, `lm-track-${route.id}`, toLngLat(route.points), {
          "line-color": isActive ? "#1a73e8" : "#94a3b8",
          "line-width": isActive ? 5 : 3,
          "line-opacity": isActive ? 1 : 0.45,
        });
      }

      const origin = activeRoute.points[0];
      if (!driverRef.current) {
        const el = document.createElement("div");
        el.className = "live-tracking-driver";
        el.innerHTML = `<svg class="live-tracking-arrow" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 3.2 L27.5 27.2 L16 21.4 L4.5 27.2 Z" fill="#1a73e8" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round" />
        </svg>`;
        driverRef.current = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([origin[1], origin[0]])
          .addTo(map);
      }
    };

    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [activeRoute, mapRef, ready]);

  useEffect(() => {
    const duration = 9000;
    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const sample = sampleAlongRoute(activeRoute.points, distances, progress);
      driverRef.current?.setLngLat([sample.position[1], sample.position[0]]);
      const arrow = driverRef.current?.getElement()?.querySelector(".live-tracking-arrow");
      if (arrow instanceof SVGElement) {
        arrow.style.transform = `rotate(${sample.heading}deg)`;
      }
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [activeRoute.points, distances]);

  if (!token) {
    return <div className="live-tracking-map h-full w-full bg-[#e8eef4]" />;
  }

  return (
    <div
      ref={containerRef}
      className="live-tracking-map h-full w-full"
      style={{ background: "#e8eef4" }}
    />
  );
}
