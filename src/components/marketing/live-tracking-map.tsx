"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  STREET_TILE_ATTRIBUTION,
  STREET_TILE_URL,
} from "@/lib/geo/map-tiles";
import {
  LIVE_TRACKING_ROUTES,
  MONTREAL_CENTER,
  type LiveTrackingRoute,
} from "@/lib/live-tracking-routes";

const GOOGLE_ARROW_SVG = `<svg class="live-tracking-arrow" viewBox="0 0 32 32" aria-hidden="true">
  <path d="M16 3.2 L27.5 27.2 L16 21.4 L4.5 27.2 Z" fill="#1a73e8" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round" />
</svg>`;

const driverIcon = L.divIcon({
  className: "live-tracking-driver",
  html: GOOGLE_ARROW_SVG,
  iconSize: [34, 34],
  iconAnchor: [17, 20],
});

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

function CenterMontreal() {
  const map = useMap();

  useEffect(() => {
    map.setView(MONTREAL_CENTER, 10, { animate: false });
    const invalidate = () => map.invalidateSize();
    invalidate();
    const frame = window.requestAnimationFrame(invalidate);
    const timeout = window.setTimeout(invalidate, 280);
    const observer = new ResizeObserver(invalidate);
    observer.observe(map.getContainer());
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [map]);

  return null;
}

function MovingDriver({ route }: { route: LiveTrackingRoute }) {
  const markerRef = useRef<L.Marker | null>(null);
  const distances = useMemo(() => cumulativeDistances(route.points), [route.points]);

  useEffect(() => {
    const duration = 9000;
    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const sample = sampleAlongRoute(route.points, distances, progress);
      markerRef.current?.setLatLng(sample.position);
      const arrow = markerRef.current?.getElement()?.querySelector(".live-tracking-arrow");
      if (arrow instanceof SVGElement) {
        arrow.style.transform = `rotate(${sample.heading}deg)`;
      }
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [distances, route.points]);

  return (
    <Marker
      ref={markerRef}
      position={route.points[0]}
      icon={driverIcon}
      interactive={false}
      zIndexOffset={800}
    />
  );
}

type LiveTrackingMapProps = {
  activeRouteId: string;
};

export default function LiveTrackingMap({ activeRouteId }: LiveTrackingMapProps) {
  const activeRoute =
    LIVE_TRACKING_ROUTES.find((route) => route.id === activeRouteId) ?? LIVE_TRACKING_ROUTES[0];
  const origin = activeRoute.points[0];
  const destination = activeRoute.points[activeRoute.points.length - 1];

  return (
    <MapContainer
      center={MONTREAL_CENTER}
      zoom={10}
      className="live-tracking-map h-full w-full"
      style={{ background: "#e8eaed" }}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer attribution={STREET_TILE_ATTRIBUTION} url={STREET_TILE_URL} />

      {LIVE_TRACKING_ROUTES.filter((route) => route.id !== activeRoute.id).map((route) => (
        <Polyline
          key={route.id}
          positions={route.points}
          pathOptions={{
            color: "#94a3b8",
            weight: 3,
            opacity: 0.45,
            lineCap: "round",
            lineJoin: "round",
          }}
          interactive={false}
        />
      ))}

      <Polyline
        positions={activeRoute.points}
        pathOptions={{ color: "#ffffff", weight: 8, opacity: 0.9, lineCap: "round", lineJoin: "round" }}
        interactive={false}
      />
      <Polyline
        positions={activeRoute.points}
        pathOptions={{ color: "#1a73e8", weight: 5, lineCap: "round", lineJoin: "round" }}
        interactive={false}
      />

      <CircleMarker
        center={origin}
        radius={7}
        pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#34a853", fillOpacity: 1 }}
        interactive={false}
      />
      <CircleMarker
        center={destination}
        radius={7}
        pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#ea4335", fillOpacity: 1 }}
        interactive={false}
      />
      <MovingDriver key={activeRoute.id} route={activeRoute} />
      <CenterMontreal />
    </MapContainer>
  );
}
