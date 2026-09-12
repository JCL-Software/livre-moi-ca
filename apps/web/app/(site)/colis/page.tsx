import type { Metadata } from "next";
import Link from "next/link";
import { ParcelCard } from "@/components/parcels/parcel-card";
import { ParcelMarketplaceFilters } from "@/components/parcels/parcel-marketplace-filters";
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
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-[clamp(1.45rem,0.95rem+2.2vw,2.5rem)] font-semibold leading-tight tracking-tight text-balance text-black dark:text-white">
              Colis disponibles
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#5E5E5E] md:text-lg dark:text-neutral-400">
              Toutes les annonces publiées par les expéditeurs. Si votre trajet
              passe près du départ et de l&apos;arrivée, proposez votre place.
            </p>
          </div>
          <Link href="/colis/nouveau" className="btn-brand shrink-0">
            Publier un colis
          </Link>
        </div>

        <ParcelMarketplaceFilters
          key={`${params.origin ?? ""}-${params.dest ?? ""}-${size ?? ""}`}
          origin={params.origin}
          dest={params.dest}
          size={size}
        />

        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
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
            <div className="rounded-xl border border-dashed border-[#E8E8E8] bg-white p-10 text-center text-slate-600 dark:border-white/10 dark:bg-neutral-950 dark:text-slate-400">
              {hasFilters
                ? "Aucun colis ne correspond à ces filtres."
                : "Aucun colis publié pour le moment."}{" "}
              <Link href="/colis/nouveau" className="underline">
                Publier un colis
              </Link>
            </div>
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
