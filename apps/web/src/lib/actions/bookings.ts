"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  confirmBookingRecord,
  createBookingRecord,
  markBookingPickedUp,
  rejectBookingRecord,
  verifyDeliveryOtpCode,
} from "@livre-moi/shared/data";
import type { ActionResult, CreateBookingInput } from "@livre-moi/shared";

export async function createBooking(
  input: CreateBookingInput,
): Promise<ActionResult<{ id: string; otp?: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Connectez-vous pour réserver." };

  const result = await createBookingRecord(supabase, user.id, input);
  if (result.ok) {
    revalidatePath(`/trajets/${input.tripId}`);
    revalidatePath("/tableau-de-bord");
  }
  return result;
}

export async function confirmBooking(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const result = await confirmBookingRecord(supabase, bookingId);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}

export async function rejectBooking(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const result = await rejectBookingRecord(supabase, bookingId);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}

export async function markPickedUp(
  bookingId: string,
  proofUrl?: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const result = await markBookingPickedUp(supabase, bookingId, proofUrl);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}

export async function verifyDeliveryOtp(
  bookingId: string,
  code: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const result = await verifyDeliveryOtpCode(supabase, bookingId, code);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}
