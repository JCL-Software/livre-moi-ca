import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SEARCH_DEST_RADIUS_KM,
  SEARCH_ORIGIN_RADIUS_KM,
} from "../constants";
import type { ActionResult, SearchTripResult, SearchTripsInput } from "../types";

export async function searchTrips(
  client: SupabaseClient,
  input: SearchTripsInput,
): Promise<ActionResult<SearchTripResult[]>> {
  const { data, error } = await client.rpc("search_trips", {
    origin_lat: input.originLat,
    origin_lng: input.originLng,
    dest_lat: input.destLat,
    dest_lng: input.destLng,
    travel_date: input.date,
    booking_kind: input.type,
    origin_radius_km: SEARCH_ORIGIN_RADIUS_KM,
    dest_radius_km: SEARCH_DEST_RADIUS_KM,
    parcel_sz: input.type === "PARCEL" ? (input.size ?? null) : null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SearchTripResult[] };
}
