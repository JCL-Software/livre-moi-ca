import {
  MAP_SEARCH_BBOX,
  MAP_SEARCH_MIN_CHARS,
  MAPBOX_PROXIMITY_MONTREAL,
} from "../constants";
import { getMapboxSecretToken } from "../env";
import type { GeoPoint, PlaceSuggestion } from "../types";

const SUGGEST_URL = "https://api.mapbox.com/search/searchbox/v1/suggest";
const RETRIEVE_URL = "https://api.mapbox.com/search/searchbox/v1/retrieve";

/** Cache suggest en mémoire (process / session serveur) — TTL court. */
const SUGGEST_TTL_MS = 10 * 60 * 1000;
const SUGGEST_CACHE_MAX = 200;

type SuggestFeature = {
  mapbox_id?: string;
  name?: string;
  full_address?: string;
  place_formatted?: string;
};

type RetrieveFeature = {
  properties?: {
    name?: string;
    full_address?: string;
    place_formatted?: string;
    coordinates?: { latitude?: number; longitude?: number };
  };
  geometry?: { coordinates?: [number, number] };
};

const suggestInflight = new Map<string, Promise<PlaceSuggestion[]>>();
const suggestCache = new Map<
  string,
  { expires: number; value: PlaceSuggestion[] }
>();

function featureName(feature: SuggestFeature) {
  return (
    feature.full_address ||
    [feature.name, feature.place_formatted].filter(Boolean).join(", ") ||
    feature.name ||
    ""
  );
}

function rememberSuggest(key: string, value: PlaceSuggestion[]) {
  if (suggestCache.size >= SUGGEST_CACHE_MAX) {
    const first = suggestCache.keys().next().value;
    if (first) suggestCache.delete(first);
  }
  suggestCache.set(key, { expires: Date.now() + SUGGEST_TTL_MS, value });
}

export async function suggestMapboxPlaces(
  query: string,
  sessionToken: string,
): Promise<PlaceSuggestion[]> {
  const token = getMapboxSecretToken();
  const q = query.trim();
  if (!token || q.length < MAP_SEARCH_MIN_CHARS || !sessionToken) return [];

  const cacheKey = q.toLowerCase().replace(/\s+/g, " ");
  const cached = suggestCache.get(cacheKey);
  if (cached && cached.expires > Date.now()) return cached.value;

  const inflightKey = `${sessionToken}:${cacheKey}`;
  const pending = suggestInflight.get(inflightKey);
  if (pending) return pending;

  const request = (async () => {
    const params = new URLSearchParams({
      q,
      access_token: token,
      session_token: sessionToken,
      language: "fr",
      country: "ca",
      limit: "5",
      types: "address,place,locality,neighborhood,postcode,street",
      bbox: MAP_SEARCH_BBOX,
      proximity: MAPBOX_PROXIMITY_MONTREAL,
    });

    const response = await fetch(`${SUGGEST_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 0 },
    } as RequestInit);

    if (!response.ok) return [];

    const data = (await response.json()) as { suggestions?: SuggestFeature[] };
    const results = (data.suggestions ?? [])
      .filter((item) => item.mapbox_id && featureName(item))
      .map((item) => ({
        mapboxId: item.mapbox_id as string,
        name: featureName(item),
      }));
    rememberSuggest(cacheKey, results);
    return results;
  })().finally(() => {
    suggestInflight.delete(inflightKey);
  });

  suggestInflight.set(inflightKey, request);
  return request;
}

const REVERSE_URL = "https://api.mapbox.com/search/searchbox/v1/reverse";

export async function reverseMapboxPlace(
  lat: number,
  lng: number,
): Promise<GeoPoint | null> {
  const token = getMapboxSecretToken();
  if (
    !token ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  const params = new URLSearchParams({
    longitude: String(lng),
    latitude: String(lat),
    access_token: token,
    language: "fr",
    limit: "1",
  });

  const response = await fetch(`${REVERSE_URL}?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) return null;

  const data = (await response.json()) as { features?: RetrieveFeature[] };
  const feature = data.features?.[0];
  const coords =
    feature?.properties?.coordinates?.longitude != null &&
    feature.properties.coordinates.latitude != null
      ? {
          lng: feature.properties.coordinates.longitude,
          lat: feature.properties.coordinates.latitude,
        }
      : { lng, lat };
  if (!Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
    return null;
  }

  const name =
    feature?.properties?.full_address ||
    [feature?.properties?.name, feature?.properties?.place_formatted]
      .filter(Boolean)
      .join(", ") ||
    "Ma position";

  return { name, lat: coords.lat, lng: coords.lng };
}

export async function retrieveMapboxPlace(
  mapboxId: string,
  sessionToken: string,
): Promise<GeoPoint | null> {
  const token = getMapboxSecretToken();
  if (!token || !mapboxId || !sessionToken) return null;

  const params = new URLSearchParams({
    access_token: token,
    session_token: sessionToken,
    language: "fr",
  });

  const response = await fetch(
    `${RETRIEVE_URL}/${encodeURIComponent(mapboxId)}?${params.toString()}`,
    {
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) return null;

  const data = (await response.json()) as { features?: RetrieveFeature[] };
  const feature = data.features?.[0];
  const coords =
    feature?.properties?.coordinates?.longitude != null &&
    feature.properties.coordinates.latitude != null
      ? {
          lng: feature.properties.coordinates.longitude,
          lat: feature.properties.coordinates.latitude,
        }
      : feature?.geometry?.coordinates
        ? { lng: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1] }
        : null;
  if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
    return null;
  }

  const name =
    feature?.properties?.full_address ||
    [feature?.properties?.name, feature?.properties?.place_formatted]
      .filter(Boolean)
      .join(", ") ||
    "Lieu";

  return { name, lat: coords.lat, lng: coords.lng };
}
