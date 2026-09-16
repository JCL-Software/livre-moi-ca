import type { SupabaseClient } from "@supabase/supabase-js";
import { publicStreetName } from "../geo/address";
import { getRoute } from "../geo/routing";
import type {
  ActionResult,
  ListOpenParcelsFilters,
  ParcelDeliveryDetails,
  ParcelListing,
  PublishParcelInput,
} from "../types";

const MARKETPLACE_COLUMNS =
  "id, user_id, title, description, origin_name, destination_name, parcel_size, category, category_detail, weight_kg, is_fragile, estimated_price, distance_km, desired_date, photo_url, status, created_at";

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

function composeDestAddress(place: string, unit?: string | null) {
  const name = place.trim();
  const suite = unit?.trim() ?? "";
  if (!name) return suite || null;
  if (!suite) return name;
  return `${name}, app. ${suite}`;
}

function deliveryDetailsRow(listingId: string, input: PublishParcelInput) {
  const firstName =
    input.recipientFirstName?.trim() ||
    input.recipientName?.trim() ||
    null;
  return {
    listing_id: listingId,
    origin_unit: input.originUnit?.trim() || null,
    origin_address:
      input.originAddress?.trim() ||
      composeDestAddress(input.originName, input.originUnit),
    dest_unit: input.destUnit?.trim() || null,
    dest_address:
      input.destAddress?.trim() ||
      composeDestAddress(input.destinationName, input.destUnit),
    recipient_first_name: firstName,
    recipient_last_name: input.recipientLastName?.trim() || null,
    recipient_phone: input.recipientPhone?.trim() || null,
    meeting_point: input.meetingPoint?.trim() || null,
    updated_at: new Date().toISOString(),
  };
}

async function upsertDeliveryDetails(
  client: SupabaseClient,
  listingId: string,
  input: PublishParcelInput,
): Promise<ActionResult<{ id: string }>> {
  const { error } = await client
    .from("parcel_delivery_details")
    .upsert(deliveryDetailsRow(listingId, input), { onConflict: "listing_id" });

  if (error) {
    return {
      ok: false,
      error: error.message || "Impossible d’enregistrer les détails de remise.",
    };
  }

  return { ok: true, data: { id: listingId } };
}

export async function getParcelDeliveryDetails(
  client: SupabaseClient,
  listingId: string,
): Promise<ParcelDeliveryDetails | null> {
  const { data, error } = await client
    .from("parcel_delivery_details")
    .select(
      "listing_id, origin_unit, origin_address, dest_unit, dest_address, recipient_first_name, recipient_last_name, recipient_phone, meeting_point",
    )
    .eq("listing_id", listingId)
    .maybeSingle();

  if (error || !data) return null;
  return data as ParcelDeliveryDetails;
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

  const publicOrigin = publicStreetName(input.originName);
  const publicDestination = publicStreetName(input.destinationName);
  const title =
    input.title?.trim() ||
    `Colis ${input.parcelSize === "EXTRA_LARGE" ? "XL" : input.parcelSize === "LARGE" ? "L" : input.parcelSize === "MEDIUM" ? "M" : "S"} · ${publicOrigin} → ${publicDestination}`;

  const { data, error } = await client
    .from("parcel_listings")
    .insert({
      user_id: userId,
      title,
      description: input.description?.trim() || null,
      origin_name: publicOrigin,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      origin_point: `SRID=4326;POINT(${input.originLng} ${input.originLat})`,
      destination_name: publicDestination,
      dest_lat: input.destLat,
      dest_lng: input.destLng,
      destination_point: `SRID=4326;POINT(${input.destLng} ${input.destLat})`,
      parcel_size: input.parcelSize,
      category: input.category ?? "PARCEL",
      category_detail:
        input.category === "OTHER"
          ? input.categoryDetail?.trim() || null
          : null,
      weight_kg: input.weightKg,
      is_fragile: input.isFragile,
      estimated_price: input.estimatedPrice ?? null,
      distance_km: distanceKm ?? null,
      desired_date: input.desiredDate || null,
      recipient_name: null,
      recipient_phone: null,
      photo_url: input.photoUrl?.trim() || null,
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

  const details = await upsertDeliveryDetails(client, data.id, input);
  if (!details.ok) {
    return details;
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

  const publicOrigin = publicStreetName(input.originName);
  const publicDestination = publicStreetName(input.destinationName);
  const title =
    input.title?.trim() ||
    `Colis ${input.parcelSize === "EXTRA_LARGE" ? "XL" : input.parcelSize === "LARGE" ? "L" : input.parcelSize === "MEDIUM" ? "M" : "S"} · ${publicOrigin} → ${publicDestination}`;

  const { data, error } = await client
    .from("parcel_listings")
    .update({
      title,
      description: input.description?.trim() || null,
      origin_name: publicOrigin,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      origin_point: `SRID=4326;POINT(${input.originLng} ${input.originLat})`,
      destination_name: publicDestination,
      dest_lat: input.destLat,
      dest_lng: input.destLng,
      destination_point: `SRID=4326;POINT(${input.destLng} ${input.destLat})`,
      parcel_size: input.parcelSize,
      category: input.category ?? "PARCEL",
      category_detail:
        input.category === "OTHER"
          ? input.categoryDetail?.trim() || null
          : null,
      weight_kg: input.weightKg,
      is_fragile: input.isFragile,
      estimated_price: input.estimatedPrice ?? null,
      distance_km: distanceKm ?? null,
      desired_date: input.desiredDate || null,
      recipient_name: null,
      recipient_phone: null,
      photo_url: input.photoUrl?.trim() || null,
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

  const details = await upsertDeliveryDetails(client, data.id, input);
  if (!details.ok) {
    return details;
  }

  return { ok: true, data: { id: data.id } };
}
