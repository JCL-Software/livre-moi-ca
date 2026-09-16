import { AccountCarpoolTabs } from "@/components/account/account-carpool-tabs";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountTripCard } from "@/components/account/account-trip-card";
import { UberButtonLink, KIND, SIZE } from "@/components/baseweb/uber-button-link";
import { UberCardLink, UberTag } from "@/components/baseweb/uber-ui";
import { requireAccount } from "@/lib/account";
import { accountCarpoolTab } from "@/lib/account-covoiturage";
import { formatDateTime, formatMoney, shortPlace } from "@/lib/account-format";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";

export default async function AccountCarpoolPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet } = await searchParams;
  const { supabase, user } = await requireAccount();
  const tab = accountCarpoolTab(onglet);

  const [{ data: myBookings }, { data: secrets }, { data: myTrips }] = await Promise.all([
    supabase
      .from("bookings")
      .select("*, trips(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("booking_secrets").select("booking_id, otp_code").eq("sender_id", user.id),
    supabase
      .from("trips")
      .select("*, bookings(*)")
      .eq("driver_id", user.id)
      .order("departure_time", { ascending: false }),
  ]);

  const otpByBooking = new Map((secrets ?? []).map((row) => [row.booking_id, row.otp_code]));
  const bookings = myBookings ?? [];
  const trips = myTrips ?? [];

  return (
    <div>
      <AccountPageHeader
        title="Covoiturage"
        description="Vos réservations passager et les trajets que vous conduisez."
        actions={
          tab === "trajets" ? (
            <UberButtonLink href="/trajets/nouveau" kind={KIND.primary} size={SIZE.compact}>
              Publier un trajet
            </UberButtonLink>
          ) : (
            <UberButtonLink href="/recherche" kind={KIND.secondary} size={SIZE.compact}>
              Rechercher un trajet
            </UberButtonLink>
          )
        }
      />

      <AccountCarpoolTabs
        tab={tab}
        voyagesCount={bookings.length}
        trajetsCount={trips.length}
        voyages={
          bookings.length === 0 ? (
            <AccountEmpty
              title="Aucune réservation"
              description="Recherchez un trajet ou publiez un colis pour créer une demande."
              action={
                <UberButtonLink href="/recherche" kind={KIND.secondary} size={SIZE.compact}>
                  Rechercher un trajet
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {bookings.map((booking) => {
                const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
                const otp = otpByBooking.get(booking.id);
                return (
                  <li key={booking.id}>
                    <UberCardLink href={`/compte/voyages/${booking.id}`}>
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
                        <p className="mt-3 mb-0 rounded-lg bg-[#EEEEEE] px-3 py-2 font-mono text-sm">
                          Code destinataire : {otp}
                        </p>
                      ) : null}
                    </UberCardLink>
                  </li>
                );
              })}
            </ul>
          )
        }
        trajets={
          trips.length === 0 ? (
            <AccountEmpty
              title="Aucun trajet publié"
              description="Publiez un trajet déjà prévu : il sera visible par tous les utilisateurs."
              action={
                <UberButtonLink href="/trajets/nouveau" kind={KIND.secondary} size={SIZE.compact}>
                  Publier un trajet
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-4">
              {trips.map((trip) => (
                <AccountTripCard key={trip.id} trip={trip} />
              ))}
            </ul>
          )
        }
      />
    </div>
  );
}
