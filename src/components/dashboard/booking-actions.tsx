"use client";

import { toast } from "sonner";
import { confirmBooking, markPickedUp, rejectBooking } from "@/lib/actions/bookings";
import { OtpDialog } from "@/components/bookings/otp-dialog";
import { Button } from "@/components/ui/button";
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
            <Button
              size="sm"
              onClick={async () => {
                const result = await confirmBooking(bookingId);
                if (!result.ok) toast.error(result.error);
                else toast.success("Réservation confirmée.");
              }}
            >
              Accepter
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                const result = await rejectBooking(bookingId);
                if (!result.ok) toast.error(result.error);
              }}
            >
              Refuser
            </Button>
          </>
        )}
        {bookingType === "PARCEL" && (status === "CONFIRMED" || status === "PENDING") && (
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              const result = await markPickedUp(bookingId);
              if (!result.ok) toast.error(result.error);
              else toast.success("Colis pris en charge.");
            }}
          >
            Colis pris en charge
          </Button>
        )}
        {bookingType === "PARCEL" && status === "PICKED_UP" && <OtpDialog bookingId={bookingId} />}
      </div>
    );
  }

  return null;
}
