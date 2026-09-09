import {
  buildRoutePoints,
  getCorridorCity,
  getRouteCityNames,
  type PopularRoute,
} from "@livre-moi/shared/geo";

export type { PopularRoute };

export { buildRoutePoints, getCorridorCity, getRouteCityNames };

export function buildSearchUrl(origin: string, destination: string) {
  const from = getCorridorCity(origin);
  const to = getCorridorCity(destination);
  if (!from || !to) return "/recherche?type=PASSENGER";

  const date = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({
    origin: from.name,
    olat: String(from.lat),
    olng: String(from.lng),
    dest: to.name,
    dlat: String(to.lat),
    dlng: String(to.lng),
    date,
    type: "PASSENGER",
  });
  return `/recherche?${params.toString()}`;
}
