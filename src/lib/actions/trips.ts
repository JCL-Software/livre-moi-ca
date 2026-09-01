"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getRoute } from "@/lib/geo/routing";
import type { ActionResult, IntermediateStop, ParcelSize, TripPreferences } from "@/lib/types";

export type PublishTripInput = {
  originName: string;
  originLat: number;
  originLng: number;
  destinationName: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  totalSeats: number;
  pricePerSeat: number;
  acceptsParcels: boolean;
  maxParcelSize: ParcelSize;
  parcelBasePrice: number;
  parcelPricePerKg: number;
  intermediateStops: IntermediateStop[];
  preferences: TripPreferences;
};

export async function publishTrip(input: PublishTripInput): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Connectez-vous pour publier un trajet." };

  const route = await getRoute(
    { lat: input.originLat, lng: input.originLng },
    { lat: input.destLat, lng: input.destLng },
  );

  const departure = new Date(input.departureTime);
  const arrival = new Date(departure.getTime() + route.durationMin * 60_000);

  const { data, error } = await supabase
    .from("trips")
    .insert({
      driver_id: user.id,
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

  await supabase
    .from("profiles")
    .update({ is_driver: true })
    .eq("id", user.id);

  revalidatePath("/");
  revalidatePath("/tableau-de-bord");
  return { ok: true, data: { id: data.id } };
}

export async function cancelTrip(tripId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const { error } = await supabase
    .from("trips")
    .update({ status: "CANCELLED" })
    .eq("id", tripId)
    .eq("driver_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}

export async function seedDemoTrips(): Promise<ActionResult<{ count: number }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Connectez-vous pour générer les trajets démo." };

  const now = new Date();
  const samples: PublishTripInput[] = [
    {
      originName: "Val-d'Or, Abitibi-Témiscamingue, Québec",
      originLat: 48.0974,
      originLng: -77.7974,
      destinationName: "Montréal, Québec",
      destLat: 45.5017,
      destLng: -73.5673,
      departureTime: new Date(now.getTime() + 2 * 24 * 3600_000).toISOString(),
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
      departureTime: new Date(now.getTime() + 3 * 24 * 3600_000).toISOString(),
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
      departureTime: new Date(now.getTime() + 1 * 24 * 3600_000).toISOString(),
      totalSeats: 4,
      pricePerSeat: 18,
      acceptsParcels: true,
      maxParcelSize: "EXTRA_LARGE",
      parcelBasePrice: 12,
      parcelPricePerKg: 0.5,
      intermediateStops: [{ name: "Rivière-Héva", lat: 48.2333, lng: -78.2167, stop_order: 1 }],
      preferences: { smoking: false, pets: true, luggage: "MEDIUM" },
    },
  ];

  let count = 0;
  for (const sample of samples) {
    const result = await publishTrip(sample);
    if (result.ok) count += 1;
  }

  return { ok: true, data: { count } };
}
