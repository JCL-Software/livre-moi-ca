"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OSM_TILE_ATTRIBUTION, OSM_TILE_URL } from "@/lib/geo/map-tiles";

const pin = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  origin: { lat: number; lng: number; name: string };
  destination: { lat: number; lng: number; name: string };
  route?: [number, number][];
  stops?: { lat: number; lng: number; name: string }[];
};

function FitBounds({
  points,
}: {
  points: { lat: number; lng: number }[];
}) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [28, 28] });
  }, [map, points]);
  return null;
}

export default function TripMap({ origin, destination, route, stops = [] }: Props) {
  const positions = route && route.length > 1 ? route : [
    [origin.lat, origin.lng] as [number, number],
    [destination.lat, destination.lng] as [number, number],
  ];

  return (
    <MapContainer
      center={[origin.lat, origin.lng]}
      zoom={7}
      className="h-full min-h-[280px] w-full rounded-xl"
      scrollWheelZoom={false}
    >
      <TileLayer attribution={OSM_TILE_ATTRIBUTION} url={OSM_TILE_URL} />
      <Marker position={[origin.lat, origin.lng]} icon={pin}>
        <Popup>{origin.name}</Popup>
      </Marker>
      {stops.map((stop) => (
        <Marker key={`${stop.name}-${stop.lat}`} position={[stop.lat, stop.lng]} icon={pin}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}
      <Marker position={[destination.lat, destination.lng]} icon={pin}>
        <Popup>{destination.name}</Popup>
      </Marker>
      <Polyline positions={positions} pathOptions={{ color: "#f97316", weight: 4 }} />
      <FitBounds points={[origin, destination, ...stops]} />
    </MapContainer>
  );
}
