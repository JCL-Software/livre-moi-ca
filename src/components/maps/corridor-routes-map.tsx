"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CORRIDOR_CITIES } from "@/lib/constants";
import {
  buildRoutePoints,
  getRouteCityNames,
  type PopularRoute,
} from "@/lib/carpool-routes";

const cityIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:10px;height:10px;border-radius:9999px;background:#1e3a5f;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.25)"></span>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const activeCityIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#f97316;border:2px solid #fff;box-shadow:0 2px 8px rgba(249,115,22,.45)"></span>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitCorridorBounds({
  points,
  selectedRoute,
}: {
  points: { lat: number; lng: number }[];
  selectedRoute: PopularRoute | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedRoute) {
      const routePoints = buildRoutePoints(selectedRoute).map(([lat, lng]) => ({ lat, lng }));
      if (routePoints.length > 0) {
        const bounds = L.latLngBounds(routePoints.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [48, 48], maxZoom: 8 });
        return;
      }
    }
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [map, points, selectedRoute]);

  return null;
}

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
  const selectedRoute = selectedIndex !== null ? routes[selectedIndex] : null;
  const activeCityNames = selectedRoute ? new Set(getRouteCityNames(selectedRoute)) : null;

  return (
    <MapContainer
      center={[47.5, -76.5]}
      zoom={6}
      className="h-full min-h-[320px] w-full rounded-2xl"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Carto'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {routes.map((route, index) => {
        const points = buildRoutePoints(route);
        const isActive = selectedIndex === index;
        if (points.length < 2) return null;

        return (
          <Polyline
            key={route.label}
            positions={points}
            pathOptions={{
              color: isActive ? "#f97316" : "#94a3b8",
              weight: isActive ? 5 : 2,
              opacity: isActive ? 1 : 0.45,
              dashArray: isActive ? undefined : "6 8",
            }}
            eventHandlers={{
              click: () => onSelectRoute(index),
              mouseover: () => onSelectRoute(index),
            }}
          />
        );
      })}

      {CORRIDOR_CITIES.map((city) => {
        const isActive = activeCityNames?.has(city.name) ?? false;
        return (
          <Marker
            key={city.name}
            position={[city.lat, city.lng]}
            icon={isActive ? activeCityIcon : cityIcon}
          >
            <Popup>
              <span className="text-sm font-semibold">{city.name}</span>
            </Popup>
          </Marker>
        );
      })}

      <FitCorridorBounds
        points={CORRIDOR_CITIES.map((city) => ({ lat: city.lat, lng: city.lng }))}
        selectedRoute={selectedRoute}
      />
    </MapContainer>
  );
}
