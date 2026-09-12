import type { SupabaseClient } from "@supabase/supabase-js";
import { getRoute } from "../geo/routing";
import type {
  ActionResult,
  ListOpenParcelsFilters,
  ParcelListing,
  PublishParcelInput,
} from "../types";

const MARKETPLACE_COLUMNS =
  "id, user_id, title, description, origin_name, destination_name, parcel_size, weight_kg, is_fragile, estimated_price, distance_km, desired_date, status, created_at";

function escapeIlike(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export async function listOpenParcelListings(
  client: SupabaseClient,
  filters: ListOpenParcelsFilters = {},
): Promise<ActionResult<ParcelListing[]>> {
  let query = client
    .from("parcel_listings")
    .select(MARKETPLACE_COLUMNS)
    .eq("status", "OPEN")
    .order("created_at", { ascending: false })
    .limit(60);

  const origin = filters.origin?.trim();
  if (origin) {
    query = query.ilike("origin_name", `%${escapeIlike(origin)}%`);
  }

  const destination = filters.destination?.trim();
  if (destination) {
    query = query.ilike("destination_name", `%${escapeIlike(destination)}%`);
  }

  if (filters.size) {
    query = query.eq("parcel_size", filters.size);
  }

  const { data, error } = await query;
  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, data: (data ?? []) as ParcelListing[] };
}

function shortPlace(name: string) {
  return name.split(",")[0]?.trim() || name;
}

export async function publishParcelRecord(
  client: SupabaseClient,
  userId: string,
  input: PublishParcelInput,
): Promise<ActionResult<{ id: string }>> {
  let distanceKm = input.distanceKm;
  if (distanceKm == null) {
    const route = await getRoute(
      { lat: input.originLat, lng: input.originLng },
      { lat: input.destLat, lng: input.destLng },
    );
    distanceKm = route.distanceKm;
  }

  const title =
    input.title?.trim() ||
    `Colis ${input.parcelSize === "EXTRA_LARGE" ? "XL" : input.parcelSize === "LARGE" ? "L" : input.parcelSize === "MEDIUM" ? "M" : "S"} · ${shortPlace(input.originName)} → ${shortPlace(input.destinationName)}`;

  const { data, error } = await client
    .from("parcel_listings")
    .insert({
      user_id: userId,
      title,
      description: input.description?.trim() || null,
      origin_name: input.originName,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      origin_point: `SRID=4326;POINT(${input.originLng} ${input.originLat})`,
      destination_name: input.destinationName,
      dest_lat: input.destLat,
      dest_lng: input.destLng,
      destination_point: `SRID=4326;POINT(${input.destLng} ${input.destLat})`,
      parcel_size: input.parcelSize,
      weight_kg: input.weightKg,
      is_fragile: input.isFragile,
      estimated_price: input.estimatedPrice ?? null,
      distance_km: distanceKm ?? null,
      desired_date: input.desiredDate || null,
      recipient_name: input.recipientName?.trim() || null,
      recipient_phone: input.recipientPhone?.trim() || null,
      status: "OPEN",
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Impossible de publier le colis.",
    };
  }

  return { ok: true, data: { id: data.id } };
}

export async function updateParcelRecord(
  client: SupabaseClient,
  userId: string,
  listingId: string,
  input: PublishParcelInput,
): Promise<ActionResult<{ id: string }>> {
  let distanceKm = input.distanceKm;
  if (distanceKm == null) {
    const route = await getRoute(
      { lat: input.originLat, lng: input.originLng },
      { lat: input.destLat, lng: input.destLng },
    );
    distanceKm = route.distanceKm;
  }

  const title =
    input.title?.trim() ||
    `Colis ${input.parcelSize === "EXTRA_LARGE" ? "XL" : input.parcelSize === "LARGE" ? "L" : input.parcelSize === "MEDIUM" ? "M" : "S"} · ${shortPlace(input.originName)} → ${shortPlace(input.destinationName)}`;

  const { data, error } = await client
    .from("parcel_listings")
    .update({
      title,
      description: input.description?.trim() || null,
      origin_name: input.originName,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      origin_point: `SRID=4326;POINT(${input.originLng} ${input.originLat})`,
      destination_name: input.destinationName,
      dest_lat: input.destLat,
      dest_lng: input.destLng,
      destination_point: `SRID=4326;POINT(${input.destLng} ${input.destLat})`,
      parcel_size: input.parcelSize,
      weight_kg: input.weightKg,
      is_fragile: input.isFragile,
      estimated_price: input.estimatedPrice ?? null,
      distance_km: distanceKm ?? null,
      desired_date: input.desiredDate || null,
      recipient_name: input.recipientName?.trim() || null,
      recipient_phone: input.recipientPhone?.trim() || null,
    })
    .eq("id", listingId)
    .eq("user_id", userId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Impossible de modifier le colis.",
    };
  }

  return { ok: true, data: { id: data.id } };
}
