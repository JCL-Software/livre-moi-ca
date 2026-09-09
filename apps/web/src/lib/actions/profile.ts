"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { submitReviewRecord, updateProfileRecord } from "@livre-moi/shared/data";
import type { ActionResult, UpdateProfileInput } from "@livre-moi/shared";

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const result = await updateProfileRecord(supabase, user.id, input);
  if (result.ok) revalidatePath("/profil");
  return result;
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

  const result = await submitReviewRecord(supabase, user.id, input);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}
