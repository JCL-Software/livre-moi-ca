import { AccountCategoryEmpty } from "@/components/account/account-category";
import {
  AccountDriverParcelCard,
  AccountOwnerParcelCard,
} from "@/components/account/account-parcel-cards";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountParcelsTabs } from "@/components/account/account-parcels-tabs";
import { UberButtonLink, KIND, SIZE } from "@/components/baseweb/uber-button-link";
import { requireAccount } from "@/lib/account";
import { accountParcelTab } from "@/lib/account-parcels";
import type { ParcelTransportOffer } from "@/lib/types";
import {
  listDriverParcelOffers,
  listParcelOffersForListings,
} from "@livre-moi/shared/data";

export default async function AccountParcelsPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet } = await searchParams;
  const { supabase, user } = await requireAccount();
  const { data: myParcels } = await supabase
    .from("parcel_listings")
    .select(
      "id, title, origin_name, destination_name, status, estimated_price, created_at, matched_conversation_id",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const [driverOffersResult, ownerOffersResult] = await Promise.all([
    listDriverParcelOffers(supabase, user.id),
    listParcelOffersForListings(
      supabase,
      user.id,
      (myParcels ?? []).map((listing) => listing.id),
    ),
  ]);

  const groupedOwnerOffers = new Map<string, ParcelTransportOffer[]>();
  for (const offer of ownerOffersResult.ok ? ownerOffersResult.data : []) {
    const current = groupedOwnerOffers.get(offer.listingId) ?? [];
    current.push(offer);
    groupedOwnerOffers.set(offer.listingId, current);
  }
  const driverOffers = driverOffersResult.ok ? driverOffersResult.data : [];
  const published = myParcels ?? [];
  const tab = accountParcelTab(onglet);

  return (
    <div>
      <AccountPageHeader
        title="Mes colis"
        actions={
          tab === "annonces" ? (
            <UberButtonLink href="/colis/nouveau" kind={KIND.primary} size={SIZE.compact}>
              Publier un colis
            </UberButtonLink>
          ) : (
            <UberButtonLink href="/colis" kind={KIND.secondary} size={SIZE.compact}>
              Colis disponibles
            </UberButtonLink>
          )
        }
      />

      <AccountParcelsTabs
        tab={tab}
        publishedCount={published.length}
        transportCount={driverOffers.length}
        published={
          published.length === 0 ? (
            <AccountCategoryEmpty
              title="Aucun colis publié"
              description="Publiez une annonce : elle sera visible par tous les utilisateurs."
              action={
                <UberButtonLink href="/colis/nouveau" kind={KIND.secondary} size={SIZE.compact}>
                  Publier un colis
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {published.map((listing) => (
                <AccountOwnerParcelCard
                  key={listing.id}
                  listing={listing}
                  offers={groupedOwnerOffers.get(listing.id) ?? []}
                />
              ))}
            </ul>
          )
        }
        transport={
          driverOffers.length === 0 ? (
            <AccountCategoryEmpty
              title="Aucun colis à transporter"
              description="Quand vous proposez de transporter un colis, il apparaît ici — avec l’expéditeur et le suivi du jumelage."
              action={
                <UberButtonLink href="/colis" kind={KIND.secondary} size={SIZE.compact}>
                  Voir les colis disponibles
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {driverOffers.map((offer) => (
                <AccountDriverParcelCard key={offer.conversationId} offer={offer} />
              ))}
            </ul>
          )
        }
      />
    </div>
  );
}
