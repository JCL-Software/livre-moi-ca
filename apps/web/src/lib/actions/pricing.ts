"use server";

import { getShortestAndFastestRoutes } from "@livre-moi/shared/geo";
import type { ActionResult } from "@livre-moi/shared";

export type ParcelRouteOption = {
  distanceKm: number;
  durationMin: number;
  /** Points [lat, lng] pour tracer l’itinéraire sur la carte. */
  coordinates: [number, number][];
};

export type ParcelRouteEstimate = {
  shortest: ParcelRouteOption;
  fastest: ParcelRouteOption;
  distinct: boolean;
};

function toLatLngPath(coordinates: [number, number][]): [number, number][] {
  const mapped = coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);
  if (mapped.length <= 300) return mapped;
  const step = Math.ceil(mapped.length / 300);
  const sampled = mapped.filter((_, index) => index % step === 0);
  const last = mapped[mapped.length - 1];
  if (
    sampled.length === 0 ||
    sampled[sampled.length - 1][0] !== last[0] ||
    sampled[sampled.length - 1][1] !== last[1]
  ) {
    sampled.push(last);
  }
  return sampled;
}

function toOption(route: {
  distanceKm: number;
  durationMin: number;
  geojson: { coordinates: [number, number][] };
}): ParcelRouteOption {
  return {
    distanceKm: route.distanceKm,
    durationMin: route.durationMin,
    coordinates: toLatLngPath(route.geojson.coordinates),
  };
}

export async function getParcelRouteDistance(input: {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}): Promise<ActionResult<ParcelRouteEstimate>> {
  if (
    ![input.originLat, input.originLng, input.destLat, input.destLng].every(
      Number.isFinite,
    )
  ) {
    return { ok: false, error: "Choisissez un départ et une destination." };
  }

  try {
    const pair = await getShortestAndFastestRoutes(
      { lat: input.originLat, lng: input.originLng },
      { lat: input.destLat, lng: input.destLng },
    );
    return {
      ok: true,
      data: {
        shortest: toOption(pair.shortest),
        fastest: toOption(pair.fastest),
        distinct: pair.distinct,
      },
    };
  } catch {
    return {
      ok: false,
      error: "Impossible de calculer l'itinéraire. Réessayez.",
    };
  }
}
