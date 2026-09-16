import { notFound } from "next/navigation";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { UberAvatar, UberCard, UberTag } from "@/components/baseweb/uber-ui";
import { UberButtonLink, KIND, SIZE } from "@/components/baseweb/uber-button-link";
import { requireAccount } from "@/lib/account";
import {
  formatDateTime,
  formatMoney,
  PAYMENT_STATUS_LABELS,
  shortPlace,
} from "@/lib/account-format";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

const STEPS: BookingStatus[] = ["PENDING", "CONFIRMED", "PICKED_UP", "DELIVERED"];

function stepIndex(status: BookingStatus) {
  if (status === "CANCELLED" || status === "REJECTED") return -1;
  return STEPS.indexOf(status);
}

export default async function AccountVoyageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user } = await requireAccount();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, trips(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!booking) notFound();

  const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
  const [{ data: secret }, { data: driver }] = await Promise.all([
    supabase
      .from("booking_secrets")
      .select("otp_code")
      .eq("booking_id", booking.id)
      .eq("sender_id", user.id)
      .maybeSingle(),
    trip?.driver_id
      ? supabase
          .from("profiles")
          .select("id, full_name, avatar_url, identity_verified, rating_avg, rating_count, vehicle_model, vehicle_color")
          .eq("id", trip.driver_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const current = stepIndex(booking.status as BookingStatus);
  const steps =
    booking.booking_type === "PARCEL"
      ? STEPS
      : (["PENDING", "CONFIRMED"] as BookingStatus[]);

  return (
    <div>
      <AccountPageHeader
        title={`${shortPlace(trip?.origin_name)} → ${shortPlace(trip?.destination_name)}`}
        description={
          booking.booking_type === "PARCEL"
            ? booking.parcel_title ?? "Envoi de colis"
            : `${booking.seats_booked} place(s) réservée(s)`
        }
      />

      <div className="space-y-4">
        <UberCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <UberTag>{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</UberTag>
            <p className="m-0 text-sm font-medium">{formatMoney(booking.total_price)}</p>
          </div>

          <ol className="mt-5 grid gap-2 sm:grid-cols-4">
            {steps.map((step, index) => {
              const done = current >= index && current >= 0;
              return (
                <li
                  key={step}
                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                    done ? "bg-black text-white" : "bg-[#F6F6F6] text-[#6B6B6B]"
                  }`}
                >
                  {BOOKING_STATUS_LABELS[step]}
                </li>
              );
            })}
          </ol>
        </UberCard>

        {secret?.otp_code && booking.status !== "DELIVERED" ? (
          <UberCard>
            <p className="m-0 text-sm font-medium text-black">Code destinataire</p>
            <p className="mt-2 mb-0 font-mono text-2xl tracking-widest">{secret.otp_code}</p>
            <p className="mt-2 mb-0 text-sm text-[#545454]">
              Le destinataire donne ce code au conducteur pour confirmer la livraison.
            </p>
          </UberCard>
        ) : null}

        <UberCard>
          <p className="m-0 font-medium text-black">Détails</p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#545454]">Départ</dt>
              <dd className="m-0">{trip ? formatDateTime(trip.departure_time) : "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#545454]">Paiement</dt>
              <dd className="m-0">
                {PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}
              </dd>
            </div>
            {booking.recipient_name ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#545454]">Destinataire</dt>
                <dd className="m-0">{booking.recipient_name}</dd>
              </div>
            ) : null}
            {driver ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#545454]">Conducteur</dt>
                <dd className="m-0 flex items-center gap-2">
                  <UberAvatar
                    name={driver.full_name || "Conducteur"}
                    src={driver.avatar_url}
                    size="32px"
                    verified={Boolean(driver.identity_verified)}
                  />
                  {driver.full_name} · {Number(driver.rating_avg ?? 5).toFixed(1)} / 5
                </dd>
              </div>
            ) : null}
            {driver?.vehicle_model ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[#545454]">Véhicule</dt>
                <dd className="m-0">
                  {driver.vehicle_color ? `${driver.vehicle_color} · ` : ""}
                  {driver.vehicle_model}
                </dd>
              </div>
            ) : null}
          </dl>
        </UberCard>

        <div className="flex flex-wrap gap-2">
          {trip?.id ? (
            <UberButtonLink href={`/trajets/${trip.id}`} kind={KIND.secondary} size={SIZE.compact}>
              Voir le trajet
            </UberButtonLink>
          ) : null}
          <UberButtonLink href="/compte/voyages" kind={KIND.tertiary} size={SIZE.compact}>
            Toutes les demandes
          </UberButtonLink>
          <UberButtonLink href="/compte/avis" kind={KIND.tertiary} size={SIZE.compact}>
            Laisser un avis
          </UberButtonLink>
        </div>
      </div>
    </div>
  );
}
