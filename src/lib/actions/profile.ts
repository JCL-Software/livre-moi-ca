"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function updateProfile(input: {
  fullName: string;
  phone?: string;
  bio?: string;
  isDriver: boolean;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleColor?: string;
  avatarUrl?: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const { error } = await supabase
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
    })
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/profil");
  return { ok: true, data: null };
}

export async function submitReview(input: {
  bookingId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const { error } = await supabase.from("reviews").insert({
    booking_id: input.bookingId,
    reviewer_id: user.id,
    reviewee_id: input.revieweeId,
    rating: input.rating,
    comment: input.comment ?? null,
  });

  if (error) return { ok: false, error: error.message };

  const { data: stats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", input.revieweeId);

  if (stats && stats.length > 0) {
    const avg = stats.reduce((sum, row) => sum + row.rating, 0) / stats.length;
    await supabase
      .from("profiles")
      .update({
        rating_avg: Number(avg.toFixed(2)),
        rating_count: stats.length,
      })
      .eq("id", input.revieweeId);
  }

  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}
