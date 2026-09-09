export const COMMISSION_RATE = 0.18;
export const PLANCHER_PRIX_CLIENT = 16.99;

export type EstimationPrixColis = {
  prixClient: number;
  remunerationConducteur: number;
  commissionPlateforme: number;
};

/**
 * Calculateur universel collaboratif Québec / Ontario.
 * @param distanceKm Distance réelle du trajet (en km)
 * @param poidsKg Poids du colis (en kg)
 */
export function estimerPrixColis(
  distanceKm: number,
  poidsKg: number,
): EstimationPrixColis {
  const d = Math.max(1, distanceKm);
  const p = Math.max(0.5, poidsKg);

  const contributionTrajet = 6.0 + 2.2 * Math.sqrt(d);
  const indemnitePoids = p <= 1 ? 0.5 : 0.5 + (p - 1) * 0.9;
  const partConducteurBrute = contributionTrajet + indemnitePoids;
  const prixClientCalcule = partConducteurBrute / (1 - COMMISSION_RATE);
  const prixClientFinal = Math.max(prixClientCalcule, PLANCHER_PRIX_CLIENT);

  return {
    prixClient: Number(prixClientFinal.toFixed(2)),
    remunerationConducteur: Number(
      (prixClientFinal * (1 - COMMISSION_RATE)).toFixed(2),
    ),
    commissionPlateforme: Number((prixClientFinal * COMMISSION_RATE).toFixed(2)),
  };
}

export function prixColisDepuisTarifTrajet(
  parcelBasePrice: number,
  parcelPricePerKg: number,
  poidsKg: number,
): number {
  return Number(parcelBasePrice) + Math.max(0, poidsKg) * Number(parcelPricePerKg);
}
