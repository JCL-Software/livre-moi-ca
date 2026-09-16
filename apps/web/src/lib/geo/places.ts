"use server";

import { createClient } from "@/lib/supabase/server";
import {
  parseAddressName,
  retrieveMapboxPlace,
  reverseMapboxPlace,
  suggestMapboxPlaces,
} from "@livre-moi/shared/geo";
import { MAP_SEARCH_MIN_CHARS } from "@livre-moi/shared/constants";
import type { GeoPoint, PlaceSuggestion } from "@/lib/types";

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function withParsedAddress(point: GeoPoint): GeoPoint {
  return { ...parseAddressName(point.name), ...point };
}

function uniquePlaces(places: PlaceSuggestion[]): PlaceSuggestion[] {
  const seen = new Set<string>();
  const unique: PlaceSuggestion[] = [];
  for (const place of places) {
    const key =
      place.mapboxId ||
      `${place.name}|${place.lat?.toFixed(5) ?? ""}|${place.lng?.toFixed(5) ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(place);
  }
  return unique;
}

export async function searchPlaces(
  query: string,
  sessionToken: string,
): Promise<PlaceSuggestion[]> {
  const q = normalizeQuery(query);
  if (q.length < MAP_SEARCH_MIN_CHARS) return [];

  const supabase = await createClient();
  const safe = q.replace(/[%_,.()]/g, " ").slice(0, 80);
  const { data: cached } = await supabase
    .from("geo_cache")
    .select("display_name, latitude, longitude, query_text")
    .or(`query_text.ilike.%${safe}%,display_name.ilike.%${safe}%`)
    .limit(6);

  if (cached && cached.length > 0) {
    return uniquePlaces(
      cached.map((row) => ({
        name: row.display_name,
        lat: row.latitude,
        lng: row.longitude,
      })),
    );
  }

  return uniquePlaces(await suggestMapboxPlaces(query, sessionToken));
}

export async function retrievePlace(
  mapboxId: string,
  sessionToken: string,
  queryText?: string,
): Promise<GeoPoint | null> {
  const idKey = `id:${mapboxId}`;
  const supabase = await createClient();
  const { data: cached } = await supabase
    .from("geo_cache")
    .select("display_name, latitude, longitude")
    .eq("query_text", idKey)
    .maybeSingle();

  if (cached) {
    return withParsedAddress({
      name: cached.display_name,
      lat: cached.latitude,
      lng: cached.longitude,
    });
  }

  const place = await retrieveMapboxPlace(mapboxId, sessionToken);
  if (!place) return null;

  await supabase.from("geo_cache").upsert([
    {
      query_text: idKey,
      display_name: place.name,
      latitude: place.lat,
      longitude: place.lng,
    },
    ...(queryText
      ? [
          {
            query_text: normalizeQuery(queryText),
            display_name: place.name,
            latitude: place.lat,
            longitude: place.lng,
          },
        ]
      : []),
  ]);

  return place;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<GeoPoint | null> {
  const place = await reverseMapboxPlace(lat, lng);
  if (!place) {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { name: "Ma position", lat, lng };
  }
  return place;
}
