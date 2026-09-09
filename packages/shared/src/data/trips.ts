import type { SupabaseClient } from "@supabase/supabase-js";
import { getRoute } from "../geo/routing";
import type { ActionResult, PublishTripInput } from "../types";

export async function publishTripRecord(
  client: SupabaseClient,
  userId: string,
  input: PublishTripInput,
): Promise<ActionResult<{ id: string }>> {
  const route = await getRoute(
    { lat: input.originLat, lng: input.originLng },
    { lat: input.destLat, lng: input.destLng },
  );

  const departure = new Date(input.departureTime);
  const arrival = new Date(departure.getTime() + route.durationMin * 60_000);

  const { data, error } = await client
    .from("trips")
    .insert({
      driver_id: userId,
      origin_name: input.originName,
      origin_lat: input.originLat,
      origin_lng: input.originLng,
      origin_point: `SRID=4326;POINT(${input.originLng} ${input.originLat})`,
      destination_name: input.destinationName,
      dest_lat: input.destLat,
      dest_lng: input.destLng,
      destination_point: `SRID=4326;POINT(${input.destLng} ${input.destLat})`,
      route_polyline: JSON.stringify(route.geojson),
      distance_km: route.distanceKm,
      estimated_duration_min: route.durationMin,
      departure_time: departure.toISOString(),
      arrival_time_est: arrival.toISOString(),
      total_seats: input.totalSeats,
      available_seats: input.totalSeats,
      price_per_seat: input.pricePerSeat,
      accepts_parcels: input.acceptsParcels,
      max_parcel_size: input.maxParcelSize,
      parcel_base_price: input.parcelBasePrice,
      parcel_price_per_kg: input.parcelPricePerKg,
      intermediate_stops: input.intermediateStops,
      preferences: input.preferences,
      status: "SCHEDULED",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Impossible de publier le trajet." };
  }

  await client.from("profiles").update({ is_driver: true }).eq("id", userId);
  return { ok: true, data: { id: data.id } };
}

export async function cancelTripRecord(
  client: SupabaseClient,
  userId: string,
  tripId: string,
): Promise<ActionResult> {
  const { error } = await client
    .from("trips")
    .update({ status: "CANCELLED" })
    .eq("id", tripId)
    .eq("driver_id", userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

export const DEMO_TRIP_SAMPLES: Omit<PublishTripInput, "departureTime">[] = [
  {
    originName: "Val-d'Or, Abitibi-Témiscamingue, Québec",
    originLat: 48.0974,
    originLng: -77.7974,
    destinationName: "Montréal, Québec",
    destLat: 45.5017,
    destLng: -73.5673,
    totalSeats: 3,
    pricePerSeat: 65,
    acceptsParcels: true,
    maxParcelSize: "LARGE",
    parcelBasePrice: 25,
    parcelPricePerKg: 1.5,
    intermediateStops: [
      { name: "Louvicourt", lat: 48.05, lng: -77.25, stop_order: 1 },
      { name: "Mont-Laurier", lat: 46.55, lng: -75.5, stop_order: 2 },
    ],
    preferences: { smoking: false, pets: true, luggage: "LARGE" },
  },
  {
    originName: "Rouyn-Noranda, Abitibi-Témiscamingue, Québec",
    originLat: 48.2394,
    originLng: -79.0186,
    destinationName: "Gatineau, Outaouais, Québec",
    destLat: 45.4765,
    destLng: -75.7013,
    totalSeats: 2,
    pricePerSeat: 55,
    acceptsParcels: true,
    maxParcelSize: "MEDIUM",
    parcelBasePrice: 20,
    parcelPricePerKg: 1,
    intermediateStops: [
      { name: "Ville-Marie", lat: 47.3339, lng: -79.4381, stop_order: 1 },
      { name: "Maniwaki", lat: 46.3756, lng: -75.9664, stop_order: 2 },
    ],
    preferences: { smoking: false, pets: false, luggage: "MEDIUM" },
  },
  {
    originName: "Amos, Abitibi-Témiscamingue, Québec",
    originLat: 48.5717,
    originLng: -78.1161,
    destinationName: "Val-d'Or, Abitibi-Témiscamingue, Québec",
    destLat: 48.0974,
    destLng: -77.7974,
    totalSeats: 4,
    pricePerSeat: 18,
    acceptsParcels: true,
    maxParcelSize: "EXTRA_LARGE",
    parcelBasePrice: 12,
    parcelPricePerKg: 0.5,
    intermediateStops: [
      { name: "Rivière-Héva", lat: 48.2333, lng: -78.2167, stop_order: 1 },
    ],
    preferences: { smoking: false, pets: true, luggage: "MEDIUM" },
  },
];
