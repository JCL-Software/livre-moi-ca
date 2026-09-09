import { CORRIDOR_CITIES, POPULAR_CARPOOL_ROUTES } from "../constants";

export type PopularRoute = (typeof POPULAR_CARPOOL_ROUTES)[number];

export function getCorridorCity(name: string) {
  return CORRIDOR_CITIES.find((city) => city.name === name);
}

export function buildRoutePoints(route: PopularRoute): [number, number][] {
  const origin = getCorridorCity(route.origin);
  const destination = getCorridorCity(route.destination);
  if (!origin || !destination) return [];

  const points: [number, number][] = [[origin.lat, origin.lng]];
  for (const waypoint of route.waypoints) {
    const city = getCorridorCity(waypoint);
    if (city) points.push([city.lat, city.lng]);
  }
  points.push([destination.lat, destination.lng]);
  return points;
}

export function getRouteCityNames(route: PopularRoute): string[] {
  return [route.origin, ...route.waypoints, route.destination];
}
