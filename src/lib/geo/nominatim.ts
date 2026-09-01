"use server";

import { createClient } from "@/lib/supabase/server";
import { QUEBEC_VIEWBOX } from "@/lib/constants";
import type { GeoPoint } from "@/lib/types";

type NominatimHit = {
  display_name: string;
  lat: string;
  lon: string;
};

function normalizeQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function searchPlaces(query: string): Promise<GeoPoint[]> {
  const q = normalizeQuery(query);
  if (q.length < 2) return [];

  const supabase = await createClient();

  const safe = q.replace(/[%_,.()]/g, " ").slice(0, 80);
  const { data: cached } = await supabase
    .from("geo_cache")
    .select("display_name, latitude, longitude, query_text")
    .or(`query_text.ilike.%${safe}%,display_name.ilike.%${safe}%`)
    .limit(6);

  if (cached && cached.length > 0) {
    return cached.map((row) => ({
      name: row.display_name,
      lat: row.latitude,
      lng: row.longitude,
    }));
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "0",
    limit: "5",
    countrycodes: "ca",
    viewbox: QUEBEC_VIEWBOX,
    bounded: "0",
  });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "Livre-moi.ca/1.0 (covoiturage Abitibi; contact@jcl-software)",
      },
      next: { revalidate: 86400 },
    },
  );

  if (!response.ok) return [];

  const hits = (await response.json()) as NominatimHit[];
  const places = hits.map((hit) => ({
    name: hit.display_name,
    lat: Number(hit.lat),
    lng: Number(hit.lon),
  }));

  if (places[0]) {
    await supabase.from("geo_cache").upsert({
      query_text: q,
      display_name: places[0].name,
      latitude: places[0].lat,
      longitude: places[0].lng,
    });
  }

  return places;
}
