import { getMapboxSecretToken } from "../env";
import type { RouteGeoJson, RouteResult } from "../types";

export type RoutePreference = "fastest" | "shortest";

type RouteOptions = {
  preference?: RoutePreference;
  overview?: "full" | "simplified";
};

type MapboxRoute = {
  distance: number;
  duration: number;
  geometry?: RouteGeoJson;
};

const MEMORY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MEMORY_MAX = 400;
const pairCache = new Map<string, { expires: number; value: RoutePair }>();
const inflight = new Map<string, Promise<RoutePair>>();

function toLineString(coords: [number, number][]): RouteGeoJson {
  return { type: "LineString", coordinates: coords };
}

function roundCoord(value: number) {
  return Number(value.toFixed(4));
}

function cacheKey(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  overview: "full" | "simplified",
) {
  return [
    roundCoord(origin.lat),
    roundCoord(origin.lng),
    roundCoord(dest.lat),
    roundCoord(dest.lng),
    overview,
  ].join(":");
}

function pickShortest<T extends { distance: number; duration: number }>(
  routes: T[],
): T | undefined {
  if (routes.length === 0) return undefined;
  return routes.reduce((best, route) => {
    if (route.distance < best.distance) return route;
    if (route.distance === best.distance && route.duration < best.duration) {
      return route;
    }
    return best;
  });
}

function pickFastest<T extends { distance: number; duration: number }>(
  routes: T[],
): T | undefined {
  if (routes.length === 0) return undefined;
  return routes.reduce((best, route) => {
    if (route.duration < best.duration) return route;
    if (route.duration === best.duration && route.distance < best.distance) {
      return route;
    }
    return best;
  });
}

function fromMapboxRoute(route: MapboxRoute): RouteResult {
  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMin: Math.round(route.duration / 60),
    geojson: route.geometry ?? toLineString([]),
  };
}

function isSameRoute(a: RouteResult, b: RouteResult) {
  return (
    Math.abs(a.distanceKm - b.distanceKm) < 0.4 &&
    Math.abs(a.durationMin - b.durationMin) < 2
  );
}

function remember(key: string, value: RoutePair) {
  if (pairCache.size >= MEMORY_MAX) {
    const first = pairCache.keys().next().value;
    if (first) pairCache.delete(first);
  }
  pairCache.set(key, { expires: Date.now() + MEMORY_TTL_MS, value });
}

export function haversineFallback(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): RouteResult {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(dest.lat - origin.lat);
  const dLng = toRad(dest.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(dest.lat)) * Math.sin(dLng / 2) ** 2;
  const distanceKm = Number((2 * R * Math.asin(Math.sqrt(a)) * 1.25).toFixed(2));

  return {
    distanceKm,
    durationMin: Math.round((distanceKm / 85) * 60),
    geojson: toLineString([
      [origin.lng, origin.lat],
      [dest.lng, dest.lat],
    ]),
  };
}

async function fetchMapboxDirections(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  overview: "full" | "simplified",
): Promise<MapboxRoute[]> {
  const token = getMapboxSecretToken();
  if (!token) throw new Error("Mapbox token manquant");

  const coordinates = `${origin.lng},${origin.lat};${dest.lng},${dest.lat}`;
  const params = new URLSearchParams({
    alternatives: "true",
    geometries: "geojson",
    overview,
    steps: "false",
    language: "fr",
    access_token: token,
  });

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 604800 },
  } as RequestInit);

  if (!response.ok) {
    throw new Error("Mapbox Directions indisponible");
  }

  const data = (await response.json()) as { routes?: MapboxRoute[] };
  return (data.routes ?? []).filter((route) => Number.isFinite(route.distance));
}

async function loadRoutePair(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  overview: "full" | "simplified",
): Promise<RoutePair> {
  try {
    const routes = await fetchMapboxDirections(origin, dest, overview);
    const shortestRaw = pickShortest(routes);
    const fastestRaw = pickFastest(routes);
    if (!shortestRaw || !fastestRaw) throw new Error("Aucun itinéraire trouvé");
    const shortest = fromMapboxRoute(shortestRaw);
    const fastest = fromMapboxRoute(fastestRaw);
    return {
      shortest,
      fastest,
      distinct: !isSameRoute(shortest, fastest),
    };
  } catch {
    const fallback = haversineFallback(origin, dest);
    return { shortest: fallback, fastest: fallback, distinct: false };
  }
}

export type RoutePair = {
  shortest: RouteResult;
  fastest: RouteResult;
  distinct: boolean;
};

export async function getShortestAndFastestRoutes(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  options?: { overview?: "full" | "simplified" },
): Promise<RoutePair> {
  const overview = options?.overview ?? "simplified";
  const key = cacheKey(origin, dest, overview);
  const cached = pairCache.get(key);
  if (cached && cached.expires > Date.now()) return cached.value;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = loadRoutePair(origin, dest, overview).then((value) => {
    remember(key, value);
    return value;
  });
  inflight.set(key, request);
  try {
    return await request;
  } finally {
    inflight.delete(key);
  }
}

export async function getRoute(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  options?: RouteOptions,
): Promise<RouteResult> {
  const preference = options?.preference ?? "fastest";
  const overview = options?.overview ?? "simplified";
  const pair = await getShortestAndFastestRoutes(origin, dest, { overview });
  return preference === "shortest" ? pair.shortest : pair.fastest;
}
