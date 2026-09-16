"use client";

import { toast } from "sonner";
import { confirmBooking, markPickedUp, rejectBooking } from "@/lib/actions/bookings";
import { OtpDialog } from "@/components/bookings/otp-dialog";
import type { BookingStatus } from "@/lib/types";

type Props = {
  bookingId: string;
  status: BookingStatus;
  bookingType: "PASSENGER" | "PARCEL";
  role: "driver" | "customer";
};

export function BookingActions({ bookingId, status, bookingType, role }: Props) {
  if (role === "driver") {
    return (
      <div className="flex flex-wrap gap-2">
        {status === "PENDING" && (
          <>
            <button
              type="button"
              className="btn-brand h-9 px-3 py-0 text-sm"
              onClick={async () => {
                const result = await confirmBooking(bookingId);
                if (!result.ok) toast.error(result.error);
                else toast.success("Réservation confirmée.");
              }}
            >
              Accepter
            </button>
            <button
              type="button"
              className="btn-brand-secondary h-9 px-3 py-0 text-sm"
              onClick={async () => {
                const result = await rejectBooking(bookingId);
                if (!result.ok) toast.error(result.error);
              }}
            >
              Refuser
            </button>
          </>
        )}
        {bookingType === "PARCEL" && (status === "CONFIRMED" || status === "PENDING") && (
          <button
            type="button"
            className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-[#545454] transition-colors hover:bg-white hover:text-black"
            onClick={async () => {
              const result = await markPickedUp(bookingId);
              if (!result.ok) toast.error(result.error);
              else toast.success("Colis pris en charge.");
            }}
          >
            Colis pris en charge
          </button>
        )}
        {bookingType === "PARCEL" && status === "PICKED_UP" && <OtpDialog bookingId={bookingId} />}
      </div>
    );
  }

  return null;
}
