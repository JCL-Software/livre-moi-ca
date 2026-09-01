import type { ParcelSize } from "@/lib/types";

export const APP_NAME = "Livre-moi.ca";
export const APP_TAGLINE = "Covoiturage et livraison de colis en Abitibi";
/** Identique Liquid-Action */
export const BRAND_ORANGE = "#f97316";
export const BRAND_ORANGE_DARK = "#ea580c";
export const BRAND_NAVY = "#1e3a5f";
export const BRAND_NAVY_MID = "#1a4a7a";
export const BRAND_NAVY_DEEP = "#0d2d4f";
export const BRAND_CREAM = "#fffaf1";
export const BRAND_BLACK = "#020617";

export const QUEBEC_VIEWBOX = "-81.5,45.0,-70.0,50.5";

export const PARCEL_LABELS: Record<ParcelSize, string> = {
  SMALL: "Petit — enveloppe ou boîte à chaussures",
  MEDIUM: "Moyen — carton standard",
  LARGE: "Grand — coffre partiel",
  EXTRA_LARGE: "Très grand — coffre plein",
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
