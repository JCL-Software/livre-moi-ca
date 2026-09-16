import Link from "next/link";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { requireAccount } from "@/lib/account";
import { formatDateTime, formatMoney, shortPlace } from "@/lib/account-format";
import { UberCard, UberTag } from "@/components/baseweb/uber-ui";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";

export default async function AccountTripsAsCustomerPage() {
  const { supabase, user } = await requireAccount();

  const [{ data: myBookings }, { data: secrets }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, trips(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("booking_secrets").select("booking_id, otp_code").eq("sender_id", user.id),
  ]);

  const otpByBooking = new Map((secrets ?? []).map((row) => [row.booking_id, row.otp_code]));

  return (
    <div>
      <AccountPageHeader
        title="Mes voyages"
        description="Demandes de place et envois de colis que vous avez réservés."
      />

      {(myBookings ?? []).length === 0 ? (
        <AccountEmpty
          title="Aucune réservation"
          description="Recherchez un trajet ou publiez un colis pour créer une demande."
          action={
            <Link href="/recherche" className="btn-brand-secondary text-sm">
              Rechercher un trajet
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {(myBookings ?? []).map((booking) => {
            const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
            const otp = otpByBooking.get(booking.id);
            return (
              <li key={booking.id}>
                <Link href={`/compte/voyages/${booking.id}`} className="block no-underline">
                  <UberCard>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="m-0 font-medium text-black">
                        {shortPlace(trip?.origin_name)} → {shortPlace(trip?.destination_name)}
                      </p>
                      <p className="mt-1 mb-0 text-sm text-[#545454]">
                        {booking.booking_type === "PARCEL"
                          ? `Colis : ${booking.parcel_title ?? "sans titre"}`
                          : `${booking.seats_booked} place(s)`}{" "}
                        · {formatMoney(booking.total_price)}
                      </p>
                      <p className="mt-1 mb-0 text-xs text-[#545454]">
                        {formatDateTime(booking.created_at)}
                      </p>
                    </div>
                    <UberTag>{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</UberTag>
                  </div>
                  {otp && booking.status !== "DELIVERED" ? (
                    <p className="mt-3 mb-0 rounded-lg bg-[#F6F6F6] px-3 py-2 font-mono text-sm">
                      Code destinataire : {otp}
                    </p>
                  ) : null}
                  </UberCard>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
