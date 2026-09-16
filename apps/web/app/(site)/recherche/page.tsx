import type { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "@/components/search/search-form";
import { TripCard } from "@/components/trips/trip-card";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { AccountCategoryEmpty } from "@/components/account/account-category";
import { SearchBackLink } from "@/components/search/search-back-link";
import { SitePage } from "@/components/layout/site-page";
import { searchTrips } from "@/lib/actions/search";
import type { BookingType, GeoPoint, ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Rechercher un trajet",
  description:
    "Trouvez une place ou de la place dans le coffre sur un trajet déjà prévu au Québec et en Ontario.",
};

type SearchParams = {
  origin?: string;
  dest?: string;
  olat?: string;
  olng?: string;
  dlat?: string;
  dlng?: string;
  date?: string;
  type?: string;
  size?: string;
  seats?: string;
};

function pointFrom(
  name?: string,
  lat?: string,
  lng?: string,
): GeoPoint | null {
  if (!name || lat == null || lng == null) return null;
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) return null;
  return { name, lat: parsedLat, lng: parsedLng };
}

function formatSearchDate(value?: string) {
  if (!value) return "Date à choisir";
  const parsed = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const hasQuery = params.olat && params.olng && params.dlat && params.dlng && params.date;
  const defaultType: BookingType = params.type === "PARCEL" ? "PARCEL" : "PASSENGER";
  const defaultSize = (params.size as ParcelSize | undefined) ?? "MEDIUM";

  const result = hasQuery
    ? await searchTrips({
        originLat: Number(params.olat),
        originLng: Number(params.olng),
        destLat: Number(params.dlat),
        destLng: Number(params.dlng),
        date: params.date!,
        type: defaultType,
        size: defaultType === "PARCEL" ? defaultSize : undefined,
      })
    : null;

  const trips = result?.ok ? result.data : [];

  return (
    <SitePage>
      <SearchBackLink />
      <UberPageIntro
        kicker={
          defaultType === "PARCEL"
            ? "Livraison collaborative"
            : "Covoiturage régional au Québec et en Ontario"
        }
        title={
          defaultType === "PARCEL"
            ? "Un conducteur est déjà en route ?"
            : "Trouvez une place dans un véhicule déjà en route."
        }
        subtitle={
          defaultType === "PARCEL"
            ? "Cherchez un trajet déjà prévu. Si aucun ne correspond, publiez votre colis : l’annonce est publique et les conducteurs vous proposent un tarif."
            : (
                <>
                  Indiquez où vous allez.
                  <br />
                  Livre-moi.ca vous montre les conducteurs vérifiés qui prennent déjà ce trajet.
                </>
              )
        }
      />

      <div className="mt-6">
        <SearchForm
          compact
          defaultType={defaultType}
          defaultOrigin={pointFrom(params.origin, params.olat, params.olng)}
          defaultDestination={pointFrom(params.dest, params.dlat, params.dlng)}
          defaultDate={params.date}
          defaultSeats={params.seats ?? "1"}
          defaultSize={defaultSize}
          submitLabel="Rechercher"
        />
      </div>

      {hasQuery ? (
        <div className="mt-8 space-y-4">
          {result && !result.ok ? (
            <p className="uber-error">{result.error}</p>
          ) : (
            <>
              <div>
                <p className="uber-home-kicker m-0">
                  {trips.length} trajet{trips.length > 1 ? "s" : ""}
                </p>
                <h2 className="uber-section-title mt-1">
                  {params.origin?.split(",")[0] ?? "Origine"} →{" "}
                  {params.dest?.split(",")[0] ?? "Destination"}
                </h2>
                <p className="uber-section-lead mt-1">
                  {formatSearchDate(params.date)}
                  {defaultType === "PARCEL" ? " · Colis" : " · Passager"}
                </p>
              </div>
              {trips.length === 0 ? (
                <AccountCategoryEmpty
                  title="Aucun trajet à cette date"
                  description={
                    defaultType === "PARCEL"
                      ? "Changez la date, ou publiez votre colis : les conducteurs vous proposeront un tarif."
                      : "Changez la date, ou publiez le vôtre — quelqu’un cherche peut-être déjà cette route."
                  }
                  action={
                    <Link
                      href={
                        defaultType === "PARCEL"
                          ? `/colis/nouveau?${new URLSearchParams({
                              ...(params.origin ? { origin: params.origin } : {}),
                              ...(params.olat ? { olat: params.olat } : {}),
                              ...(params.olng ? { olng: params.olng } : {}),
                              ...(params.dest ? { dest: params.dest } : {}),
                              ...(params.dlat ? { dlat: params.dlat } : {}),
                              ...(params.dlng ? { dlng: params.dlng } : {}),
                              ...(params.date ? { date: params.date } : {}),
                              ...(params.size ? { size: params.size } : {}),
                            }).toString()}`
                          : "/trajets/nouveau"
                      }
                      className="btn-brand h-11 px-5"
                    >
                      {defaultType === "PARCEL"
                        ? "Publier un colis"
                        : "Publier un trajet"}
                    </Link>
                  }
                />
              ) : (
                <div className="grid gap-3">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : null}
    </SitePage>
  );
}
