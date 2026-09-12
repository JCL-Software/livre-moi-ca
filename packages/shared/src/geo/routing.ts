import { getOrsApiKey } from "../env";
import type { RouteGeoJson, RouteResult } from "../types";

export type RoutePreference = "fastest" | "shortest";

type RouteOptions = {
  preference?: RoutePreference;
};

function toLineString(coords: [number, number][]): RouteGeoJson {
  return { type: "LineString", coordinates: coords };
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

function fromOsrmRoute(route: {
  distance: number;
  duration: number;
  geometry: RouteGeoJson;
}): RouteResult {
  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMin: Math.round(route.duration / 60),
    geojson: route.geometry,
  };
}

function isSameRoute(a: RouteResult, b: RouteResult) {
  return (
    Math.abs(a.distanceKm - b.distanceKm) < 0.4 &&
    Math.abs(a.durationMin - b.durationMin) < 2
  );
}

async function routeWithOrs(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  apiKey: string,
  preference: RoutePreference,
): Promise<RouteResult> {
  const response = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [origin.lng, origin.lat],
          [dest.lng, dest.lat],
        ],
        preference: preference === "shortest" ? "shortest" : "recommended",
      }),
    },
  );

  if (!response.ok) {
    throw new Error("ORS indisponible");
  }

  const data = (await response.json()) as {
    features?: Array<{
      properties?: { summary?: { distance: number; duration: number } };
      geometry: RouteGeoJson;
    }>;
  };
  const features = (data.features ?? []).map((item) => ({
    distance: item.properties?.summary?.distance ?? Number.POSITIVE_INFINITY,
    duration: item.properties?.summary?.duration ?? Number.POSITIVE_INFINITY,
    item,
  }));
  const picked =
    preference === "shortest" ? pickShortest(features) : pickFastest(features);
  const feature = picked?.item ?? data.features?.[0];
  const summary = feature?.properties?.summary;
  if (!feature || !summary) throw new Error("ORS indisponible");
  return {
    distanceKm: Number((summary.distance / 1000).toFixed(2)),
    durationMin: Math.round(summary.duration / 60),
    geojson: feature.geometry,
  };
}

async function fetchOsrmRoutes(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  alternatives: boolean,
) {
  const extra = alternatives ? "&alternatives=true" : "";
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson${extra}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("OSRM indisponible");
  }

  const data = (await response.json()) as {
    routes?: Array<{
      distance: number;
      duration: number;
      geometry: RouteGeoJson;
    }>;
  };
  return data.routes ?? [];
}

async function routeWithOsrm(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  preference: RoutePreference,
): Promise<RouteResult> {
  let routes: Awaited<ReturnType<typeof fetchOsrmRoutes>> = [];
  try {
    routes = await fetchOsrmRoutes(origin, dest, preference === "shortest");
  } catch {
    if (preference !== "shortest") throw new Error("OSRM indisponible");
    routes = await fetchOsrmRoutes(origin, dest, false);
  }

  const picked =
    preference === "shortest" ? pickShortest(routes) : pickFastest(routes);
  if (!picked) throw new Error("Aucun itinéraire trouvé");

  return fromOsrmRoute(picked);
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

export async function getRoute(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  options?: RouteOptions,
): Promise<RouteResult> {
  const preference = options?.preference ?? "fastest";
  const orsKey = getOrsApiKey();

  if (orsKey) {
    try {
      return await routeWithOrs(origin, dest, orsKey, preference);
    } catch {
      // repli OSRM
    }
  }

  try {
    return await routeWithOsrm(origin, dest, preference);
  } catch {
    return haversineFallback(origin, dest);
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
): Promise<RoutePair> {
  const orsKey = getOrsApiKey();

  if (orsKey) {
    try {
      const [shortest, fastest] = await Promise.all([
        routeWithOrs(origin, dest, orsKey, "shortest"),
        routeWithOrs(origin, dest, orsKey, "fastest"),
      ]);
      return {
        shortest,
        fastest,
        distinct: !isSameRoute(shortest, fastest),
      };
    } catch {
      // repli OSRM
    }
  }

  try {
    let routes = await fetchOsrmRoutes(origin, dest, true);
    if (routes.length === 0) {
      routes = await fetchOsrmRoutes(origin, dest, false);
    }
    const shortestOsrm = pickShortest(routes);
    const fastestOsrm = pickFastest(routes);
    if (!shortestOsrm || !fastestOsrm) throw new Error("Aucun itinéraire trouvé");
    const shortest = fromOsrmRoute(shortestOsrm);
    const fastest = fromOsrmRoute(fastestOsrm);
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
