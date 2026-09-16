import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActionResult,
  BookingType,
  ReceivedReview,
  ReviewableBooking,
  UpdateProfileInput,
} from "../types";

import { publicStreetName } from "../geo/address";

function shortPlace(name: string) {
  return publicStreetName(name);
}

export async function updateProfileRecord(
  client: SupabaseClient,
  userId: string,
  input: UpdateProfileInput,
): Promise<ActionResult> {
  const { error } = await client
    .from("profiles")
    .update({
      full_name: input.fullName,
      phone: input.phone || null,
      bio: input.bio || null,
      is_driver: input.isDriver,
      vehicle_model: input.vehicleModel || null,
      vehicle_plate: input.vehiclePlate || null,
      vehicle_color: input.vehicleColor || null,
      avatar_url: input.avatarUrl || null,
      accepts_parcels: input.acceptsParcels,
    })
    .eq("id", userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

export type PublicMemberProfile = {
  id: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_driver: boolean;
  vehicle_model: string | null;
  vehicle_color: string | null;
  rating_avg: number;
  rating_count: number;
  identity_verified: boolean;
  accepts_parcels: boolean;
};

export async function getPublicMemberProfile(
  client: SupabaseClient,
  memberId: string,
): Promise<ActionResult<PublicMemberProfile | null>> {
  const { data, error } = await client
    .from("profiles")
    .select(
      "id, full_name, bio, avatar_url, is_driver, vehicle_model, vehicle_color, rating_avg, rating_count, identity_verified, accepts_parcels",
    )
    .eq("id", memberId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: true, data: null };

  return {
    ok: true,
    data: {
      id: data.id,
      full_name: data.full_name || "Membre",
      bio: data.bio,
      avatar_url: data.avatar_url,
      is_driver: Boolean(data.is_driver),
      vehicle_model: data.vehicle_model,
      vehicle_color: data.vehicle_color,
      rating_avg: Number(data.rating_avg ?? 5),
      rating_count: data.rating_count ?? 0,
      identity_verified: Boolean(data.identity_verified),
      accepts_parcels: Boolean(data.accepts_parcels),
    },
  };
}

export async function submitReviewRecord(
  client: SupabaseClient,
  reviewerId: string,
  input: {
    bookingId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  },
): Promise<ActionResult> {
  const { error } = await client.from("reviews").insert({
    booking_id: input.bookingId,
    reviewer_id: reviewerId,
    reviewee_id: input.revieweeId,
    rating: input.rating,
    comment: input.comment ?? null,
  });

  if (error) return { ok: false, error: error.message };

  const { data: stats } = await client
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", input.revieweeId);

  if (stats && stats.length > 0) {
    const avg = stats.reduce((sum, row) => sum + row.rating, 0) / stats.length;
    await client
      .from("profiles")
      .update({
        rating_avg: Number(avg.toFixed(2)),
        rating_count: stats.length,
      })
      .eq("id", input.revieweeId);
  }

  return { ok: true, data: null };
}

export async function listReceivedReviews(
  client: SupabaseClient,
  userId: string,
): Promise<ActionResult<ReceivedReview[]>> {
  const { data, error } = await client
    .from("reviews")
    .select("id, booking_id, reviewer_id, rating, comment, created_at")
    .eq("reviewee_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { ok: false, error: error.message };

  const rows = data ?? [];
  const reviewerIds = [...new Set(rows.map((row) => row.reviewer_id))];
  const { data: profiles } = reviewerIds.length
    ? await client
        .from("profiles")
        .select("id, full_name")
        .in("id", reviewerIds)
    : { data: [] };
  const names = new Map(
    (profiles ?? []).map((row) => [row.id, row.full_name || "Membre"]),
  );

  return {
    ok: true,
    data: rows.map((row) => ({
      id: row.id,
      booking_id: row.booking_id,
      reviewer_id: row.reviewer_id,
      reviewer_name: names.get(row.reviewer_id) ?? "Membre",
      rating: row.rating,
      comment: row.comment,
      created_at: row.created_at,
    })),
  };
}

type TripJoin = {
  id: string;
  driver_id: string;
  origin_name: string;
  destination_name: string;
};

function unwrapTrip(value: TripJoin | TripJoin[] | null | undefined): TripJoin | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function isReviewableStatus(status: string, bookingType: BookingType) {
  if (status === "CANCELLED" || status === "REJECTED" || status === "PENDING") {
    return false;
  }
  if (bookingType === "PARCEL") return status === "DELIVERED";
  return status === "CONFIRMED" || status === "DELIVERED";
}

export async function listReviewableBookings(
  client: SupabaseClient,
  userId: string,
): Promise<ActionResult<ReviewableBooking[]>> {
  const { data: myReviews } = await client
    .from("reviews")
    .select("booking_id")
    .eq("reviewer_id", userId);
  const reviewed = new Set((myReviews ?? []).map((row) => row.booking_id));

  const [{ data: customerBookings }, { data: driverTrips }] = await Promise.all([
    client
      .from("bookings")
      .select(
        "id, booking_type, status, user_id, trips ( id, driver_id, origin_name, destination_name )",
      )
      .eq("user_id", userId)
      .in("status", ["CONFIRMED", "DELIVERED"]),
    client
      .from("trips")
      .select(
        "id, driver_id, origin_name, destination_name, bookings ( id, booking_type, status, user_id )",
      )
      .eq("driver_id", userId),
  ]);

  const candidates: Array<{
    booking_id: string;
    reviewee_id: string;
    route: string;
    booking_type: BookingType;
    role: "customer" | "driver";
  }> = [];

  for (const booking of customerBookings ?? []) {
    const bookingType = booking.booking_type as BookingType;
    if (!isReviewableStatus(booking.status, bookingType)) continue;
    if (reviewed.has(booking.id)) continue;
    const trip = unwrapTrip(booking.trips as TripJoin | TripJoin[] | null);
    if (!trip?.driver_id || trip.driver_id === userId) continue;
    candidates.push({
      booking_id: booking.id,
      reviewee_id: trip.driver_id,
      route: `${shortPlace(trip.origin_name)} → ${shortPlace(trip.destination_name)}`,
      booking_type: bookingType,
      role: "customer",
    });
  }

  for (const trip of driverTrips ?? []) {
    const bookings = (trip.bookings ?? []) as Array<{
      id: string;
      booking_type: BookingType;
      status: string;
      user_id: string;
    }>;
    for (const booking of bookings) {
      if (!isReviewableStatus(booking.status, booking.booking_type)) continue;
      if (reviewed.has(booking.id)) continue;
      if (!booking.user_id || booking.user_id === userId) continue;
      candidates.push({
        booking_id: booking.id,
        reviewee_id: booking.user_id,
        route: `${shortPlace(trip.origin_name)} → ${shortPlace(trip.destination_name)}`,
        booking_type: booking.booking_type,
        role: "driver",
      });
    }
  }

  const revieweeIds = [...new Set(candidates.map((item) => item.reviewee_id))];
  const { data: profiles } = revieweeIds.length
    ? await client
        .from("profiles")
        .select("id, full_name")
        .in("id", revieweeIds)
    : { data: [] };
  const names = new Map(
    (profiles ?? []).map((row) => [row.id, row.full_name || "Membre"]),
  );

  return {
    ok: true,
    data: candidates.map((item) => ({
      ...item,
      reviewee_name: names.get(item.reviewee_id) ?? "Membre",
    })),
  };
}
