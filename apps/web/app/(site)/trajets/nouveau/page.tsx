import type { Metadata } from "next";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { PublishTripForm } from "@/components/trips/publish-trip-form";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Publier un trajet",
  description: `Publiez un trajet déjà prévu sur ${APP_NAME}. Il est visible par tous les utilisateurs, qui peuvent réserver une place ou le coffre.`,
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
};

function parseNumber(value?: string) {
  if (!value) return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function parseDepartureTime(date?: string, time?: string) {
  if (!date) return "";
  if (date.includes("T")) return date.slice(0, 16);
  if (time && /^\d{2}:\d{2}$/.test(time)) return `${date}T${time}`;
  return `${date}T08:00`;
}

export default async function NewTripPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const originLat = parseNumber(params.olat);
  const originLng = parseNumber(params.olng);
  const destLat = parseNumber(params.dlat);
  const destLng = parseNumber(params.dlng);
  const fromHome = Boolean(params.origin && params.dest);

  return (
    <SitePage>
      <SiteBackLink href="/compte/trajets">Mes trajets</SiteBackLink>
      <UberPageIntro
        kicker="Covoiturage régional au Québec et en Ontario"
        title="Votre trajet est déjà prévu. Partagez-le simplement."
        subtitle={
          fromHome ? (
            <>
              Votre trajet est visible par tous les utilisateurs
              <br />
              Les champs de départ et d’arrivée sont déjà remplis.
            </>
          ) : (
            "Votre trajet est visible par tous les utilisateurs. Proposez les places libres de votre véhicule — et le coffre, si vous le souhaitez."
          )
        }
      />
      <div className="mt-6">
        <PublishTripForm
          defaults={{
            origin:
              params.origin && originLat != null && originLng != null
                ? { name: params.origin, lat: originLat, lng: originLng }
                : null,
            destination:
              params.dest && destLat != null && destLng != null
                ? { name: params.dest, lat: destLat, lng: destLng }
                : null,
            departureTime: parseDepartureTime(params.date, params.time),
          }}
        />
      </div>
    </SitePage>
  );
}
