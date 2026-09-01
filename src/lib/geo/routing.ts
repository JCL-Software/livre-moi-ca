export type RouteGeoJson = {
  type: "LineString";
  coordinates: [number, number][];
};

export type RouteResult = {
  distanceKm: number;
  durationMin: number;
  geojson: RouteGeoJson;
};

function toLineString(coords: [number, number][]): RouteGeoJson {
  return { type: "LineString", coordinates: coords };
}

async function routeWithOrs(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
  apiKey: string,
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
      }),
    },
  );

  if (!response.ok) {
    throw new Error("ORS indisponible");
  }

  const data = await response.json();
  const feature = data.features?.[0];
  const summary = feature?.properties?.summary;
  return {
    distanceKm: Number((summary.distance / 1000).toFixed(2)),
    durationMin: Math.round(summary.duration / 60),
    geojson: feature.geometry,
  };
}

async function routeWithOsrm(
  origin: { lat: number; lng: number },
  dest: { lat: number; lng: number },
): Promise<RouteResult> {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    throw new Error("OSRM indisponible");
  }

  const data = await response.json();
  const route = data.routes?.[0];
  if (!route) throw new Error("Aucun itinéraire trouvé");

  return {
    distanceKm: Number((route.distance / 1000).toFixed(2)),
    durationMin: Math.round(route.duration / 60),
    geojson: route.geometry,
  };
}

function haversineFallback(
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
): Promise<RouteResult> {
  const orsKey = process.env.ORS_API_KEY;

  if (orsKey) {
    try {
      return await routeWithOrs(origin, dest, orsKey);
    } catch {
      // repli OSRM
    }
  }

  try {
    return await routeWithOsrm(origin, dest);
  } catch {
    return haversineFallback(origin, dest);
  }
}
