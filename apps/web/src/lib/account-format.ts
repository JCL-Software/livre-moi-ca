import { publicStreetName } from "@livre-moi/shared/geo";

export function shortPlace(name: string | null | undefined) {
  return publicStreetName(name);
}

export function formatMoney(value: number | string | null | undefined) {
  return `${Number(value ?? 0).toFixed(2)} $`;
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  unpaid: "Non payé",
  pending: "En attente",
  paid: "Payé",
  refunded: "Remboursé",
  failed: "Échoué",
};
