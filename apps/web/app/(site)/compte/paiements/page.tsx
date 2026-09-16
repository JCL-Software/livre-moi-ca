import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountStatusPill } from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";
import { requireAccount } from "@/lib/account";
import { formatMoney, PAYMENT_STATUS_LABELS } from "@/lib/account-format";
import { UberButtonLink, KIND, SIZE } from "@/components/baseweb/uber-button-link";

export default async function AccountPaymentsPage() {
  const { supabase, user } = await requireAccount();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, total_price, payment_status, booking_type, parcel_title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div>
      <AccountPageHeader
        title="Paiements"
        description="Suivez les montants liés à vos réservations. Le paiement se fait en ligne via la plateforme."
      />

      <UberCard className="mb-6">
        <p className="m-0 text-sm font-medium text-black">Paiement sécurisé</p>
        <p className="mt-2 mb-0 text-sm leading-relaxed text-[#545454]">
          Les paiements sont sécurisés et conservés jusqu’à la confirmation de
          livraison. Aucun échange d’argent comptant entre les parties.
        </p>
      </UberCard>

      {(bookings ?? []).length === 0 ? (
        <AccountEmpty
          title="Aucun paiement"
          description="Les montants liés à vos réservations apparaîtront ici."
          action={
            <UberButtonLink href="/recherche" kind={KIND.secondary} size={SIZE.compact}>
              Rechercher un trajet
            </UberButtonLink>
          }
        />
      ) : (
        <ul className="m-0 space-y-3 p-0">
          {(bookings ?? []).map((booking) => (
            <li key={booking.id}>
              <UberCard>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="m-0 font-medium text-black">
                      {booking.booking_type === "PARCEL"
                        ? booking.parcel_title ?? "Colis"
                        : "Place passager"}
                    </p>
                    <div className="mt-2">
                      <AccountStatusPill tone="soft">
                        {PAYMENT_STATUS_LABELS[booking.payment_status] ?? booking.payment_status}
                      </AccountStatusPill>
                    </div>
                  </div>
                  <p className="m-0 font-semibold text-black">{formatMoney(booking.total_price)}</p>
                </div>
              </UberCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
