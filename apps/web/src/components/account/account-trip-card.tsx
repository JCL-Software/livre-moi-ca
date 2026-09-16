import Link from "next/link";
import { ArrowRight, Car, Package, Users } from "lucide-react";
import {
  AccountIconTile,
  AccountPriceBlock,
  AccountStatusPill,
} from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";
import { CancelTripButton } from "@/components/account/cancel-trip-button";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { formatDateTime, shortPlace } from "@/lib/account-format";
import { BOOKING_STATUS_LABELS, TRIP_STATUS_LABELS } from "@/lib/constants";
import type { BookingStatus, TripStatus } from "@/lib/types";

type TripBooking = {
  id: string;
  status: BookingStatus;
  booking_type: "PASSENGER" | "PARCEL";
  parcel_title: string | null;
  seats_booked: number;
  recipient_name: string | null;
};

function tripTone(status: TripStatus): "solid" | "soft" | "muted" {
  if (status === "ACTIVE") return "solid";
  if (status === "SCHEDULED") return "soft";
  return "muted";
}

function bookingTone(status: BookingStatus): "solid" | "soft" | "muted" {
  if (status === "CONFIRMED" || status === "PICKED_UP" || status === "DELIVERED") {
    return "solid";
  }
  if (status === "PENDING") return "soft";
  return "muted";
}

export function AccountTripCard({
  trip,
}: {
  trip: {
    id: string;
    origin_name: string;
    destination_name: string;
    departure_time: string;
    status: string;
    price_per_seat: number | null;
    available_seats: number | null;
    total_seats: number | null;
    accepts_parcels: boolean | null;
    bookings: TripBooking[] | null;
  };
}) {
  const status = trip.status as TripStatus;
  const bookings = [...(trip.bookings ?? [])].sort((a, b) => {
    if (a.status === "PENDING" && b.status !== "PENDING") return -1;
    if (a.status !== "PENDING" && b.status === "PENDING") return 1;
    return 0;
  });
  const pendingCount = bookings.filter((booking) => booking.status === "PENDING").length;

  return (
    <UberCard as="li">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <AccountIconTile>
            <Car className="h-5 w-5" aria-hidden />
          </AccountIconTile>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/trajets/${trip.id}`}
                className="uber-card-title hover:underline"
              >
                {shortPlace(trip.origin_name)} → {shortPlace(trip.destination_name)}
              </Link>
              <AccountStatusPill tone={tripTone(status)}>
                {TRIP_STATUS_LABELS[status] ?? status}
              </AccountStatusPill>
            </div>
            <p className="text-sm font-medium text-[#545454]">
              {formatDateTime(trip.departure_time)}
            </p>
            <p className="text-sm text-neutral-500">
              {trip.available_seats != null
                ? `${trip.available_seats} place${trip.available_seats > 1 ? "s" : ""} libre${trip.available_seats > 1 ? "s" : ""}`
                : null}
              {trip.accepts_parcels ? " · Accepte les colis" : ""}
              {pendingCount > 0
                ? ` · ${pendingCount} demande${pendingCount > 1 ? "s" : ""} à traiter`
                : ""}
            </p>
          </div>
        </div>
        <AccountPriceBlock
          amount={trip.price_per_seat != null ? Number(trip.price_per_seat) : null}
          label="par place"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/trajets/${trip.id}`}
          className="btn-brand-secondary h-10 gap-1.5 px-4 py-0 text-sm"
        >
          Voir le trajet
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {status === "SCHEDULED" ? <CancelTripButton tripId={trip.id} /> : null}
      </div>

      <div className="mt-4">
        {bookings.length === 0 ? (
          <div className="rounded-lg bg-[#EEEEEE] px-4 py-3 text-sm text-[#545454]">
            Aucune demande pour l&apos;instant.
          </div>
        ) : (
          <ul className="space-y-2">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-lg bg-[#EEEEEE] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black">
                      {booking.booking_type === "PARCEL" ? (
                        <Package className="h-4 w-4" aria-hidden />
                      ) : (
                        <Users className="h-4 w-4" aria-hidden />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="m-0 font-medium text-black">
                          {booking.booking_type === "PARCEL"
                            ? booking.parcel_title ?? "Colis"
                            : `${booking.seats_booked} passager${booking.seats_booked > 1 ? "s" : ""}`}
                        </p>
                        <AccountStatusPill tone={bookingTone(booking.status)}>
                          {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                        </AccountStatusPill>
                      </div>
                      {booking.recipient_name ? (
                        <p className="mt-0.5 text-sm text-neutral-500">
                          Pour {booking.recipient_name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <BookingActions
                    bookingId={booking.id}
                    status={booking.status}
                    bookingType={booking.booking_type}
                    role="driver"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </UberCard>
  );
}
