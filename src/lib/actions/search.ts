"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult, BookingType, ParcelSize, SearchTripResult } from "@/lib/types";

export async function searchTrips(input: {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  date: string;
  type: BookingType;
  size?: ParcelSize;
}): Promise<ActionResult<SearchTripResult[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("search_trips", {
    origin_lat: input.originLat,
    origin_lng: input.originLng,
    dest_lat: input.destLat,
    dest_lng: input.destLng,
    travel_date: input.date,
    booking_kind: input.type,
    origin_radius_km: 25,
    dest_radius_km: 30,
    parcel_sz: input.type === "PARCEL" ? (input.size ?? null) : null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as SearchTripResult[] };
}
