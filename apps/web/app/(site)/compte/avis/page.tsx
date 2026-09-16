import Link from "next/link";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ReviewForm } from "@/components/account/review-form";
import { UberCard } from "@/components/baseweb/uber-ui";
import { requireAccount } from "@/lib/account";
import { formatDateTime } from "@/lib/account-format";
import { listReceivedReviews, listReviewableBookings } from "@livre-moi/shared/data";

export default async function AccountReviewsPage() {
  const { supabase, user, profile } = await requireAccount();
  const [received, reviewable] = await Promise.all([
    listReceivedReviews(supabase, user.id),
    listReviewableBookings(supabase, user.id),
  ]);
  const receivedReviews = received.ok ? received.data : [];
  const pending = reviewable.ok ? reviewable.data : [];

  return (
    <div>
      <AccountPageHeader
        title="Avis"
        description={`Votre note actuelle : ${Number(profile?.rating_avg ?? 5).toFixed(1)} / 5 (${profile?.rating_count ?? 0} avis).`}
      />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-black">Avis à laisser</h2>
          {pending.length === 0 ? (
            <AccountEmpty
              title="Rien à noter pour le moment"
              description="Après une livraison ou un trajet confirmé, vous pourrez évaluer l’autre personne."
            />
          ) : (
            <ul className="m-0 space-y-3 p-0">
              {pending.map((item) => (
                <li key={`${item.booking_id}-${item.reviewee_id}`}>
                  <UberCard>
                    <p className="mb-3 text-sm text-[#545454]">
                      {item.route} · {item.role === "driver" ? "Passager / expéditeur" : "Conducteur"}
                    </p>
                    <ReviewForm
                      bookingId={item.booking_id}
                      revieweeId={item.reviewee_id}
                      revieweeName={item.reviewee_name}
                    />
                  </UberCard>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-black">Avis reçus</h2>
          {receivedReviews.length === 0 ? (
            <AccountEmpty
              title="Aucun avis reçu"
              description="Les notes laissées après vos trajets et livraisons s’afficheront ici."
            />
          ) : (
            <ul className="m-0 space-y-3 p-0">
              {receivedReviews.map((item) => (
                <li key={item.id}>
                  <UberCard>
                    <p className="m-0 text-sm font-medium text-black">
                      {item.reviewer_name} · {item.rating} / 5
                    </p>
                    {item.comment ? (
                      <p className="mt-2 mb-0 text-sm text-[#545454]">{item.comment}</p>
                    ) : null}
                    <p className="mt-2 mb-0 text-xs text-[#545454]">{formatDateTime(item.created_at)}</p>
                  </UberCard>
                </li>
              ))}
            </ul>
          )}
        </section>

        <Link href="/compte/voyages" className="text-sm text-[#545454] underline-offset-4 hover:underline">
          Mes voyages
        </Link>
      </div>
    </div>
  );
}
