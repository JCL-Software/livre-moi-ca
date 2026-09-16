import type { ParcelSize } from "./types";

export const COMMISSION_RATE = 0.18;
export const PLANCHER_PRIX_CLIENT = 16.99;
export const BASE_PRISE_EN_CHARGE = 14.5;
export const COEFF_DISTANCE = 1.8438;
export const PRIX_PAR_KG_EXTRA = 1.0357;
export const MAX_OFFER_MULTIPLIER = 1.5;

export const SUPPLEMENTS_FORMAT: Record<ParcelSize, number> = {
  SMALL: 0,
  MEDIUM: 1.5,
  LARGE: 2.5,
  EXTRA_LARGE: 3.5,
};

export type EstimationPrixColis = {
  prixClient: number;
  remunerationConducteur: number;
  commissionPlateforme: number;
};

function roundCad(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Calculateur de tarif colis (Québec / Ontario).
 * Prix client = max(plancher, prise en charge + km dégressif + poids + format).
 */
export function estimerPrixColis(
  distanceKm: number,
  poidsKg: number,
  format: ParcelSize = "SMALL",
): EstimationPrixColis {
  const distance = Math.max(0, Number(distanceKm) || 0);
  const poids = Math.max(0.1, Number(poidsKg) || 1);
  const supplement =
    SUPPLEMENTS_FORMAT[format] ?? SUPPLEMENTS_FORMAT.SMALL;

  const partDistance =
    BASE_PRISE_EN_CHARGE + COEFF_DISTANCE * Math.sqrt(distance);
  const partPoids = Math.max(0, poids - 1) * PRIX_PAR_KG_EXTRA;
  const prixClient = roundCad(
    Math.max(PLANCHER_PRIX_CLIENT, partDistance + partPoids + supplement),
  );
  const commissionPlateforme = roundCad(prixClient * COMMISSION_RATE);
  const remunerationConducteur = roundCad(prixClient - commissionPlateforme);

  return {
    prixClient,
    remunerationConducteur,
    commissionPlateforme,
  };
}

export function formatPrixCad(amount: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

export function decouperPrixClient(prixClient: number) {
  const rounded = roundCad(Number(prixClient));
  const commissionPlateforme = roundCad(rounded * COMMISSION_RATE);
  return {
    prixClient: rounded,
    remunerationConducteur: roundCad(rounded - commissionPlateforme),
    commissionPlateforme,
  };
}

export function bornesPrixOffre(suggestedPrice: number) {
  const suggested = Math.max(
    PLANCHER_PRIX_CLIENT,
    Number(Number(suggestedPrice).toFixed(2)) || PLANCHER_PRIX_CLIENT,
  );
  return {
    min: PLANCHER_PRIX_CLIENT,
    max: Number((suggested * MAX_OFFER_MULTIPLIER).toFixed(2)),
    suggested,
  };
}

export function validerPrixOffre(
  prix: number,
  suggestedPrice: number,
): { ok: true; prix: number; min: number; max: number } | { ok: false; error: string; min: number; max: number } {
  const { min, max, suggested } = bornesPrixOffre(suggestedPrice);
  const rounded = Number(Number(prix).toFixed(2));
  if (!Number.isFinite(rounded)) {
    return { ok: false, error: "Indiquez un montant valide.", min, max };
  }
  if (rounded < min) {
    return {
      ok: false,
      error: `Le prix plancher est de ${formatPrixCad(min)}.`,
      min,
      max,
    };
  }
  if (rounded > max) {
    return {
      ok: false,
      error: `Le prix ne peut pas dépasser ${formatPrixCad(max)} (1,5× le prix suggéré de ${formatPrixCad(suggested)}).`,
      min,
      max,
    };
  }
  return { ok: true, prix: rounded, min, max };
}

export function suggestedPriceFromListing(listing: {
  estimated_price?: number | null;
  distance_km?: number | null;
  weight_kg?: number | null;
  parcel_size?: ParcelSize | null;
}) {
  if (listing.estimated_price != null && Number.isFinite(Number(listing.estimated_price))) {
    return roundCad(Number(listing.estimated_price));
  }
  if (listing.distance_km != null && listing.weight_kg != null) {
    return estimerPrixColis(
      Number(listing.distance_km),
      Number(listing.weight_kg),
      listing.parcel_size ?? "SMALL",
    ).prixClient;
  }
  return PLANCHER_PRIX_CLIENT;
}

export function prixColisDepuisTarifTrajet(
  parcelBasePrice: number,
  parcelPricePerKg: number,
  poidsKg: number,
): number {
  return Number(parcelBasePrice) + Math.max(0, poidsKg) * Number(parcelPricePerKg);
}
