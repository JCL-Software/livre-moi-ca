import type { ReactNode } from "react";
import { Car, Package, ShieldCheck, Star } from "lucide-react";
import {
  AccountCategory,
  AccountCategoryEmpty,
} from "@/components/account/account-category";
import { AccountIconTile } from "@/components/account/account-ui";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { formatDateTime } from "@/lib/account-format";
import type { PublicMemberProfile } from "@livre-moi/shared/data";
import type { ReceivedReview } from "@livre-moi/shared";

export function MemberProfileView({
  member,
  reviews,
}: {
  member: PublicMemberProfile;
  reviews: ReceivedReview[];
}) {
  const vehicle = [member.vehicle_color, member.vehicle_model]
    .filter(Boolean)
    .join(" ");
  const role = member.is_driver ? "Transporteur" : "Membre";

  return (
    <SitePage>
      <SiteBackLink href="/compte/colis?onglet=annonces">Mes colis</SiteBackLink>

      <UberPageIntro title={member.full_name} subtitle={role} />

      <div className="mt-6">
        <UberCard>
          <div className="flex flex-wrap items-center gap-5">
            <UberAvatar
              name={member.full_name}
              src={member.avatar_url}
              size="72px"
              verified={member.identity_verified}
            />
            <div className="min-w-0">
              <p className="uber-price">
                {member.rating_avg.toFixed(1)} / 5
              </p>
              <p className="mt-0.5 mb-0 flex items-center gap-1 text-xs text-[#545454]">
                <Star className="h-3.5 w-3.5 fill-black text-black" aria-hidden />
                {member.rating_count} avis
              </p>
            </div>
          </div>

          {member.bio ? (
            <p className="uber-section-lead mt-4">{member.bio}</p>
          ) : null}

          <div className="mt-5 grid gap-4 border-t border-[#EEEEEE] pt-5 sm:grid-cols-3">
            <Fact
              icon={
                <ShieldCheck
                  className="h-5 w-5"
                  color={member.identity_verified ? "#059669" : undefined}
                  aria-hidden
                />
              }
              label="Identité"
              value={member.identity_verified ? "Vérifiée" : "Non vérifiée"}
            />
            <Fact
              icon={<Car className="h-5 w-5" aria-hidden />}
              label="Véhicule"
              value={vehicle || "Non renseigné"}
            />
            <Fact
              icon={<Package className="h-5 w-5" aria-hidden />}
              label="Colis"
              value={member.accepts_parcels ? "Acceptés" : "Non acceptés"}
            />
          </div>
        </UberCard>
      </div>

      <div className="mt-5">
        <AccountCategory
          icon={<Star className="h-5 w-5" color="#D4AF37" aria-hidden />}
          title="Avis reçus"
          description="Notes laissées après un trajet ou une livraison."
          count={reviews.length}
        >
          {reviews.length === 0 ? (
            <AccountCategoryEmpty
              title="Aucun avis pour le moment"
              description="Les évaluations de ce membre apparaîtront ici après un trajet ou une livraison."
            />
          ) : (
            <ul className="space-y-3">
              {reviews.map((item) => (
                <li key={item.id} className="rounded-lg bg-[#F6F6F6] px-4 py-3">
                  <p className="m-0 text-sm font-medium text-black">
                    {item.reviewer_name} · {item.rating} / 5
                  </p>
                  {item.comment ? (
                    <p className="mt-1 mb-0 text-sm text-[#545454]">{item.comment}</p>
                  ) : null}
                  <p className="mt-1 mb-0 text-xs text-[#545454]">
                    {formatDateTime(item.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AccountCategory>
      </div>
    </SitePage>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <AccountIconTile>{icon}</AccountIconTile>
      <div className="min-w-0">
        <p className="uber-home-kicker">{label}</p>
        <p className="uber-card-title mt-0.5">{value}</p>
      </div>
    </div>
  );
}
