import type { ParcelSize } from "./types";

export const APP_NAME = "Livre-moi.ca";
export const APP_TAGLINE =
  "Covoiturage et livraison de colis au Québec et en Ontario";
export const BRAND_ORANGE = "#000000";
export const BRAND_ORANGE_DARK = "#1a1a1a";
export const BRAND_NAVY = "#000000";
export const BRAND_NAVY_MID = "#1a1a1a";
export const BRAND_NAVY_DEEP = "#000000";
export const BRAND_CREAM = "#f6f6f6";
export const BRAND_BLACK = "#000000";

export const QUEBEC_VIEWBOX = "-81.5,45.0,-70.0,50.5";

export const PARCEL_LABELS: Record<ParcelSize, string> = {
  SMALL: "Petit — Enveloppe ou petit sac",
  MEDIUM: "Moyen — Boîte à chaussures ou petit carton",
  LARGE: "Grand — Carton ou petite valise",
  EXTRA_LARGE: "Très grand — Plusieurs boîtes ou équipement volumineux",
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PICKED_UP: "En transit",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
  REJECTED: "Refusée",
};

export const TRIP_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Planifié",
  ACTIVE: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export const CORRIDOR_CITIES = [
  { name: "Val-d'Or", lat: 48.0974, lng: -77.7974 },
  { name: "Rouyn-Noranda", lat: 48.2394, lng: -79.0186 },
  { name: "Amos", lat: 48.5717, lng: -78.1161 },
  { name: "La Sarre", lat: 48.8006, lng: -79.2003 },
  { name: "Malartic", lat: 48.1367, lng: -78.1256 },
  { name: "Senneterre", lat: 48.3906, lng: -77.2392 },
  { name: "Rivière-Héva", lat: 48.2333, lng: -78.2167 },
  { name: "Louvicourt", lat: 48.05, lng: -77.25 },
  { name: "Ville-Marie", lat: 47.3339, lng: -79.4381 },
  { name: "Mont-Laurier", lat: 46.55, lng: -75.5 },
  { name: "Maniwaki", lat: 46.3756, lng: -75.9664 },
  { name: "Gatineau", lat: 45.4765, lng: -75.7013 },
  { name: "Montréal", lat: 45.5017, lng: -73.5673 },
] as const;

export const POPULAR_CARPOOL_ROUTES = [
  {
    label: "Rouyn-Noranda ⇄ Montréal",
    via: "via Val-d'Or et Mont-Laurier",
    priceFrom: 45,
    origin: "Rouyn-Noranda",
    destination: "Montréal",
    waypoints: ["Val-d'Or", "Mont-Laurier"] as const,
  },
  {
    label: "Val-d'Or ⇄ Gatineau / Ottawa",
    via: "via Grand-Remous",
    priceFrom: 40,
    origin: "Val-d'Or",
    destination: "Gatineau",
    waypoints: ["Mont-Laurier", "Maniwaki"] as const,
  },
  {
    label: "Amos ⇄ Rouyn-Noranda",
    via: "",
    priceFrom: 15,
    origin: "Amos",
    destination: "Rouyn-Noranda",
    waypoints: [] as const,
  },
  {
    label: "La Sarre ⇄ Val-d'Or",
    via: "",
    priceFrom: 20,
    origin: "La Sarre",
    destination: "Val-d'Or",
    waypoints: ["Amos"] as const,
  },
  {
    label: "Ville-Marie / Témiscaming ⇄ Rouyn",
    via: "",
    priceFrom: 20,
    origin: "Ville-Marie",
    destination: "Rouyn-Noranda",
    waypoints: [] as const,
  },
  {
    label: "Val-d'Or ⇄ Québec",
    via: "",
    priceFrom: 55,
    origin: "Val-d'Or",
    destination: "Montréal",
    waypoints: ["Mont-Laurier"] as const,
  },
] as const;

export const LUGGAGE_FILTER_LABELS = {
  SMALL: "Petit sac à dos",
  MEDIUM: "Valise cabine",
  LARGE: "Grand sac / équipement",
} as const;

export const SEARCH_ORIGIN_RADIUS_KM = 25;
export const SEARCH_DEST_RADIUS_KM = 30;
