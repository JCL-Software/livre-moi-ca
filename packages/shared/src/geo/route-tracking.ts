import {
  ROUTE_DEVIATION_THRESHOLD_M,
  ROUTE_RECALC_MIN_INTERVAL_MS,
} from "../constants";

type LatLng = { lat: number; lng: number };

/** Distance haversine en mètres. */
export function distanceMeters(a: LatLng, b: LatLng): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Distance minimale (m) d’un point à une polyligne [lng, lat][] (GeoJSON).
 * Calcul local — aucun appel Mapbox.
 */
export function distanceToRouteMeters(
  point: LatLng,
  coordinates: [number, number][],
): number {
  if (coordinates.length === 0) return Number.POSITIVE_INFINITY;
  if (coordinates.length === 1) {
    return distanceMeters(point, {
      lng: coordinates[0][0],
      lat: coordinates[0][1],
    });
  }

  let min = Number.POSITIVE_INFINITY;
  for (let i = 1; i < coordinates.length; i += 1) {
    const a = { lng: coordinates[i - 1][0], lat: coordinates[i - 1][1] };
    const b = { lng: coordinates[i][0], lat: coordinates[i][1] };
    min = Math.min(min, distancePointToSegmentMeters(point, a, b));
  }
  return min;
}

function distancePointToSegmentMeters(
  point: LatLng,
  a: LatLng,
  b: LatLng,
): number {
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  if (dx === 0 && dy === 0) return distanceMeters(point, a);

  // Approximation plane locale (QC/ON) — suffisante pour un seuil ~200 m.
  const latScale = 111_320;
  const lngScale = 111_320 * Math.cos((point.lat * Math.PI) / 180);
  const px = (point.lng - a.lng) * lngScale;
  const py = (point.lat - a.lat) * latScale;
  const bx = dx * lngScale;
  const by = dy * latScale;
  const t = Math.max(0, Math.min(1, (px * bx + py * by) / (bx * bx + by * by)));
  return Math.hypot(px - bx * t, py - by * t);
}

/**
 * ETA approximatif restant (minutes) en interpolant la position sur le tracé.
 * `durationMin` = durée totale du trajet Directions initial.
 */
export function estimateEtaFromProgress(
  point: LatLng,
  coordinates: [number, number][],
  durationMin: number,
): number {
  if (coordinates.length < 2 || durationMin <= 0) return durationMin;

  const distances: number[] = [0];
  for (let i = 1; i < coordinates.length; i += 1) {
    distances.push(
      distances[i - 1] +
        distanceMeters(
          { lng: coordinates[i - 1][0], lat: coordinates[i - 1][1] },
          { lng: coordinates[i][0], lat: coordinates[i][1] },
        ),
    );
  }
  const total = distances[distances.length - 1] || 1;

  let closestDist = Number.POSITIVE_INFINITY;
  let closestAlong = 0;
  for (let i = 1; i < coordinates.length; i += 1) {
    const a = { lng: coordinates[i - 1][0], lat: coordinates[i - 1][1] };
    const b = { lng: coordinates[i][0], lat: coordinates[i][1] };
    const d = distancePointToSegmentMeters(point, a, b);
    if (d < closestDist) {
      closestDist = d;
      const segLen = distances[i] - distances[i - 1] || 1;
      const latScale = 111_320;
      const lngScale = 111_320 * Math.cos((point.lat * Math.PI) / 180);
      const dx = (b.lng - a.lng) * lngScale;
      const dy = (b.lat - a.lat) * latScale;
      const px = (point.lng - a.lng) * lngScale;
      const py = (point.lat - a.lat) * latScale;
      const t =
        dx === 0 && dy === 0
          ? 0
          : Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
      closestAlong = distances[i - 1] + segLen * t;
    }
  }

  const remainingRatio = Math.max(0, 1 - closestAlong / total);
  return Math.max(1, Math.round(durationMin * remainingRatio));
}

/**
 * Faut-il relancer Directions ? Défaut : déviation > 200 m ET ≥ 2 min depuis
 * le dernier calcul. Sinon : tracking GPS local uniquement.
 */
export function shouldRecalculateRoute(input: {
  position: LatLng;
  routeCoordinates: [number, number][];
  lastCalculatedAt: number;
  now?: number;
  deviationThresholdM?: number;
  minIntervalMs?: number;
}): boolean {
  const now = input.now ?? Date.now();
  const minInterval = input.minIntervalMs ?? ROUTE_RECALC_MIN_INTERVAL_MS;
  if (now - input.lastCalculatedAt < minInterval) return false;

  const threshold = input.deviationThresholdM ?? ROUTE_DEVIATION_THRESHOLD_M;
  return (
    distanceToRouteMeters(input.position, input.routeCoordinates) > threshold
  );
}
