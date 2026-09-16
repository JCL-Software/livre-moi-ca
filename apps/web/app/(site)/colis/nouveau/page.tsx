import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { PublishParcelForm } from "@/components/parcels/publish-parcel-form";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import type { ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Publier un colis",
  description: `Publiez votre colis sur ${APP_NAME}. L’annonce est visible par tous les utilisateurs, comme les trajets publiés.`,
};

type SearchParams = {
  origin?: string;
  dest?: string;
  olat?: string;
  olng?: string;
  dlat?: string;
  dlng?: string;
  date?: string;
  time?: string;
  size?: string;
  fragile?: string;
  weight?: string;
  price?: string;
  distance?: string;
  step?: string;
};

const SIZES = new Set<ParcelSize>([
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
]);

function parseNumber(value?: string) {
  if (!value) return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

export default async function NewParcelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  let loggedIn = false;
  if (configured) {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();
    loggedIn = Boolean(session.data.user);
  }

  const originLat = parseNumber(params.olat);
  const originLng = parseNumber(params.olng);
  const destLat = parseNumber(params.dlat);
  const destLng = parseNumber(params.dlng);
  const weight = parseNumber(params.weight);
  const price = parseNumber(params.price);
  const distance = parseNumber(params.distance);
  const size = params.size && SIZES.has(params.size as ParcelSize)
    ? (params.size as ParcelSize)
    : null;
  const fromEstimator = Boolean(params.origin && params.dest);

  return (
    <SitePage>
      <SiteBackLink href="/compte/colis">Mes colis</SiteBackLink>
      <UberPageIntro
        kicker="Livraison collaborative"
        title="Publier un colis"
        subtitle={
          fromEstimator ? (
            <>
              Votre annonce est publique et donc visible par tous les utilisateurs
              <br />
              Les champs de l’estimateur sont déjà remplis.
            </>
          ) : (
            "Votre annonce est publique et donc visible par tous les utilisateurs."
          )
        }
      />
      <div className="mt-6">
        <Suspense>
          <PublishParcelForm
            loggedIn={loggedIn}
            defaults={{
              origin:
                params.origin && originLat != null && originLng != null
                  ? { name: params.origin, lat: originLat, lng: originLng }
                  : null,
              destination:
                params.dest && destLat != null && destLng != null
                  ? { name: params.dest, lat: destLat, lng: destLng }
                  : null,
              size,
              weight: weight ?? 1,
              fragile: params.fragile === "1",
              date: params.date
                ? params.time
                  ? `${params.date}T${params.time}`
                  : params.date
                : new Date().toISOString().slice(0, 10),
              price,
              distance,
            }}
          />
        </Suspense>
      </div>
    </SitePage>
  );
}
