"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateOtp, hashOtp } from "@/lib/otp";
import type { ActionResult, BookingType, ParcelSize } from "@/lib/types";

export async function createBooking(input: {
  tripId: string;
  bookingType: BookingType;
  seatsBooked?: number;
  parcelTitle?: string;
  parcelDescription?: string;
  parcelSize?: ParcelSize;
  parcelWeightKg?: number;
  parcelPhotoUrl?: string;
  recipientName?: string;
  recipientPhone?: string;
}): Promise<ActionResult<{ id: string; otp?: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Connectez-vous pour réserver." };

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select(
      "id, driver_id, available_seats, price_per_seat, accepts_parcels, parcel_base_price, parcel_price_per_kg, status",
    )
    .eq("id", input.tripId)
    .single();

  if (tripError || !trip) return { ok: false, error: "Trajet introuvable." };
  if (trip.driver_id === user.id) {
    return { ok: false, error: "Vous ne pouvez pas réserver votre propre trajet." };
  }
  if (trip.status !== "SCHEDULED") {
    return { ok: false, error: "Ce trajet n'accepte plus de réservations." };
  }

  let totalPrice = 0;
  let otp: string | undefined;
  let otpHash: string | null = null;

  if (input.bookingType === "PASSENGER") {
    const seats = input.seatsBooked ?? 1;
    if (seats < 1 || seats > trip.available_seats) {
      return { ok: false, error: "Pas assez de places disponibles." };
    }
    totalPrice = Number(trip.price_per_seat) * seats;
  } else {
    if (!trip.accepts_parcels) {
      return { ok: false, error: "Ce trajet n'accepte pas les colis." };
    }
    const weight = input.parcelWeightKg ?? 0;
    totalPrice = Number(trip.parcel_base_price) + weight * Number(trip.parcel_price_per_kg);
    otp = generateOtp(6);
    otpHash = hashOtp(otp);
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      trip_id: input.tripId,
      user_id: user.id,
      booking_type: input.bookingType,
      status: "PENDING",
      seats_booked: input.bookingType === "PASSENGER" ? (input.seatsBooked ?? 1) : 0,
      parcel_title: input.parcelTitle ?? null,
      parcel_description: input.parcelDescription ?? null,
      parcel_size: input.parcelSize ?? null,
      parcel_weight_kg: input.parcelWeightKg ?? null,
      parcel_photo_url: input.parcelPhotoUrl ?? null,
      recipient_name: input.recipientName ?? null,
      recipient_phone: input.recipientPhone ?? null,
      delivery_otp_hash: otpHash,
      total_price: totalPrice,
      payment_status: "PAYMENT_PENDING",
    })
    .select("id")
    .single();

  if (error || !booking) {
    return { ok: false, error: error?.message ?? "Réservation impossible." };
  }

  if (otp) {
    await supabase.from("booking_secrets").insert({
      booking_id: booking.id,
      sender_id: user.id,
      otp_code: otp,
    });
  }

  if (input.bookingType === "PASSENGER") {
    await supabase
      .from("trips")
      .update({ available_seats: trip.available_seats - (input.seatsBooked ?? 1) })
      .eq("id", trip.id);
  }

  revalidatePath(`/trajets/${input.tripId}`);
  revalidatePath("/tableau-de-bord");
  return { ok: true, data: { id: booking.id, otp } };
}

export async function confirmBooking(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: "CONFIRMED" })
    .eq("id", bookingId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}

export async function rejectBooking(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, trip_id, booking_type, seats_booked, trips(available_seats)")
    .eq("id", bookingId)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status: "REJECTED" })
    .eq("id", bookingId);

  if (error) return { ok: false, error: error.message };

  if (booking?.booking_type === "PASSENGER" && booking.trips) {
    const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
    if (trip) {
      await supabase
        .from("trips")
        .update({ available_seats: Number(trip.available_seats) + booking.seats_booked })
        .eq("id", booking.trip_id);
    }
  }

  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}

export async function markPickedUp(
  bookingId: string,
  proofUrl?: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "PICKED_UP",
      pickup_proof_url: proofUrl ?? null,
    })
    .eq("id", bookingId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}

export async function verifyDeliveryOtp(
  bookingId: string,
  code: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("verify_delivery_otp", {
    p_booking_id: bookingId,
    p_code: code.trim(),
  });

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Code OTP invalide." };

  revalidatePath("/tableau-de-bord");
  return { ok: true, data: null };
}
