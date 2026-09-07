import { SearchForm } from "@/components/search/search-form";
import { TripCard } from "@/components/trips/trip-card";
import { searchTrips } from "@/lib/actions/search";
import type { BookingType, ParcelSize } from "@/lib/types";

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
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const hasQuery = params.olat && params.olng && params.dlat && params.dlng && params.date;

  const result = hasQuery
    ? await searchTrips({
        originLat: Number(params.olat),
        originLng: Number(params.olng),
        destLat: Number(params.dlat),
        destLng: Number(params.dlng),
        date: params.date!,
        type: (params.type as BookingType) ?? "PASSENGER",
        size: params.size as ParcelSize | undefined,
      })
    : null;

  const trips = result?.ok ? result.data : [];
  const defaultType: BookingType = params.type === "PARCEL" ? "PARCEL" : "PASSENGER";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Recherche</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Rechercher un trajet</h1>
        <p className="text-muted-foreground">
          Matching spatial : départ à 25 km, arrivée à 30 km, arrêts du corridor inclus.
        </p>
      </div>
      <SearchForm compact defaultType={defaultType} />

      {hasQuery && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {params.origin} → {params.dest} · {params.date} · {trips.length} résultat
            {trips.length > 1 ? "s" : ""}
          </p>
          {result && !result.ok && (
            <p className="text-sm text-destructive">{result.error}</p>
          )}
          {trips.length === 0 && result?.ok && (
            <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-muted-foreground">
              Aucun trajet sur cette date. Publiez le vôtre ou élargissez la recherche.
            </div>
          )}
          <div className="grid gap-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
