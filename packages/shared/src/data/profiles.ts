import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActionResult, UpdateProfileInput } from "../types";

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
