import type { Metadata } from "next";
import Link from "next/link";
import { ParcelCard } from "@/components/parcels/parcel-card";
import { ParcelMarketplaceFilters } from "@/components/parcels/parcel-marketplace-filters";
import { UberButtonLink } from "@/components/baseweb/uber-button-link";
import { UberEmpty } from "@/components/baseweb/uber-ui";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { listParcels } from "@/lib/actions/parcels";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import type { ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Colis disponibles",
  description: `Parcourez les colis publiés sur ${APP_NAME} et proposez votre trajet aux expéditeurs du Québec et de l'Ontario.`,
};

type SearchParams = {
  origin?: string;
  dest?: string;
  size?: string;
};

const SIZES = new Set<ParcelSize>([
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
]);

export default async function ParcelMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const size =
    params.size && SIZES.has(params.size as ParcelSize)
      ? (params.size as ParcelSize)
      : undefined;

  const result = await listParcels({
    origin: params.origin,
    destination: params.dest,
    size,
  });

  const listings = result.ok ? result.data : [];
  const hasFilters = Boolean(params.origin || params.dest || size);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <UberPageIntro
          title="Colis disponibles"
          subtitle="Toutes les annonces publiées sont visibles par tout le monde. Si votre trajet passe près du départ et de l’arrivée, proposez votre place."
          action={
            <UberButtonLink href="/colis/nouveau">Publier un colis</UberButtonLink>
          }
        />

        <ParcelMarketplaceFilters
          key={`${params.origin ?? ""}-${params.dest ?? ""}-${size ?? ""}`}
          origin={params.origin}
          dest={params.dest}
          size={size}
        />

        <div className="space-y-4">
          <p className="uber-home-kicker">
            {listings.length === 0
              ? hasFilters
                ? "Aucune annonce correspondante"
                : "Aucune annonce ouverte"
              : `${listings.length} annonce${listings.length > 1 ? "s" : ""} ${
                  hasFilters ? "correspondante" : "ouverte"
                }${listings.length > 1 ? "s" : ""}`}
          </p>

          {!result.ok ? (
            <p className="text-sm text-destructive">{result.error}</p>
          ) : null}

          {result.ok && listings.length === 0 ? (
            <UberEmpty
              title={
                hasFilters
                  ? "Aucun colis ne correspond à ces filtres."
                  : "Aucun colis publié pour le moment."
              }
              description={
                hasFilters
                  ? "Modifiez les filtres, ou publiez une annonce visible par tout le monde."
                  : "Publiez une annonce : elle sera visible par tout le monde."
              }
              action={
                <Link href="/colis/nouveau" className="btn-brand h-12 px-5">
                  Publier un colis
                </Link>
              }
            />
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {listings.map((listing) => (
              <ParcelCard
                key={listing.id}
                listing={listing}
                isMine={user?.id === listing.user_id}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
