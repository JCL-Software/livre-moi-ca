import type { Metadata } from "next";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { ParcelEstimator } from "@/components/pricing/parcel-estimator";
import { APP_NAME } from "@/lib/constants";
import type { GeoPoint, ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Estimateur de prix colis",
  description: `Estimez le coût d'un envoi collaboratif avec ${APP_NAME}. Prix indicatif selon la distance réelle et le poids du colis, au Québec et en Ontario.`,
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
  weight?: string;
  fragile?: string;
  from?: string;
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

function pointFromParams(
  name: string | undefined,
  lat: number | undefined,
  lng: number | undefined,
): GeoPoint | null {
  if (!name || lat == null || lng == null) return null;
  return { name, lat, lng };
}

export default async function CalculateurPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const initialOrigin = pointFromParams(
    params.origin,
    parseNumber(params.olat),
    parseNumber(params.olng),
  );
  const initialDestination = pointFromParams(
    params.dest,
    parseNumber(params.dlat),
    parseNumber(params.dlng),
  );
  const fromPublish = params.from === "publish";
  const size =
    params.size && SIZES.has(params.size as ParcelSize)
      ? (params.size as ParcelSize)
      : null;
  const weight = parseNumber(params.weight);

  const backHref = fromPublish
    ? `/colis/nouveau?${new URLSearchParams({
        ...(params.origin ? { origin: params.origin } : {}),
        ...(params.olat ? { olat: params.olat } : {}),
        ...(params.olng ? { olng: params.olng } : {}),
        ...(params.dest ? { dest: params.dest } : {}),
        ...(params.dlat ? { dlat: params.dlat } : {}),
        ...(params.dlng ? { dlng: params.dlng } : {}),
        ...(params.date ? { date: params.date } : {}),
        ...(params.time ? { time: params.time } : {}),
        ...(params.size ? { size: params.size } : {}),
        ...(params.weight ? { weight: params.weight } : {}),
        ...(params.fragile === "1" ? { fragile: "1" } : {}),
        step: "1",
      }).toString()}`
    : "/";

  return (
    <SitePage>
      <SiteBackLink href={backHref}>
        {fromPublish ? "Retour à la publication" : "Colis"}
      </SiteBackLink>
      <UberPageIntro
        kicker="Livraison collaborative"
        title="Combien coûte l'envoi d'un colis ?"
        subtitle={
          fromPublish ? (
            <>
              Votre trajet est déjà repris.
              <br />
              Ajustez le colis, estimez le prix, puis continuez la publication.
            </>
          ) : (
            <>
              Entrez les informations du colis pour obtenir une estimation
              <br />
              et recevoir des offres de conducteurs.
            </>
          )
        }
      />
      <div className="mt-6">
        <ParcelEstimator
          initialOrigin={initialOrigin}
          initialDestination={initialDestination}
          initialDate={params.date}
          initialTime={params.time}
          initialSize={size}
          initialWeight={weight}
          initialFragile={params.fragile === "1"}
          returnToPublish={fromPublish}
        />
      </div>
    </SitePage>
  );
}
