export type AddressParts = {
  unit?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

const REGION_BY_KEY: Record<string, string> = {
  qc: "Québec",
  quebec: "Québec",
  on: "Ontario",
  ontario: "Ontario",
};

function fold(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeRegion(value: string) {
  const mapped = REGION_BY_KEY[fold(value)];
  return mapped ?? value.trim();
}

export function formatPostalCode(value: string) {
  const compact = value.toUpperCase().replace(/\s+/g, "");
  if (compact.length === 6) return `${compact.slice(0, 3)} ${compact.slice(3)}`;
  return value.trim();
}

export function parsePostalCode(text: string) {
  const match = text
    .toUpperCase()
    .match(/\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d\b/);
  return match ? formatPostalCode(match[0]) : "";
}

function isCountry(value: string) {
  return fold(value) === "canada";
}

function isRegion(value: string) {
  return Boolean(REGION_BY_KEY[fold(value)]);
}

export function parseAddressName(name: string): AddressParts {
  const postalCode = parsePostalCode(name);
  const cleaned = postalCode
    ? name.replace(/\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d\b/i, "")
    : name;
  const parts = cleaned
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let country = "";
  if (parts.length && isCountry(parts[parts.length - 1] ?? "")) {
    country = "Canada";
    parts.pop();
  }

  let region = "";
  if (parts.length && isRegion(parts[parts.length - 1] ?? "")) {
    region = normalizeRegion(parts.pop() ?? "");
  }

  let city = "";
  if (parts.length === 1) {
    city = parts[0] ?? "";
  } else if (parts.length > 1) {
    city = /^\d/.test(parts[0] ?? "") ? (parts[1] ?? parts[0] ?? "") : (parts[0] ?? "");
  }

  return {
    city: city || undefined,
    region: region || undefined,
    postalCode: postalCode || undefined,
    country: country || "Canada",
  };
}

/**
 * Raccourcit Saint / Sainte dans un libellé public.
 * Ex. Saint-Hippolyte → St-Hippolyte, Sainte-Sophie → Ste-Sophie.
 */
export function abbreviatePlaceName(value: string): string {
  return value
    .replace(/\bSaintes-/gi, "Stes-")
    .replace(/\bSaints-/gi, "Sts-")
    .replace(/\bSainte-/gi, "Ste-")
    .replace(/\bSaint-/gi, "St-")
    .replace(/\bSaintes\s+/gi, "Stes ")
    .replace(/\bSaints\s+/gi, "Sts ")
    .replace(/\bSainte\s+/gi, "Ste ")
    .replace(/\bSaint\s+/gi, "St ");
}

/**
 * Libellé public d’un lieu : nom de rue sans numéro civique, avec la ville.
 * Ex. « 405 Route 111, La Corne, Québec… » → « Route 111, La Corne ».
 * L’adresse exacte reste réservée aux détails privés (après acceptation).
 */
export function publicStreetName(name: string | null | undefined): string {
  if (!name?.trim()) return "—";

  const segments = name
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const line = segments[0] || name.trim();
  const street =
    line
      .replace(/^\d+[A-Za-z]?(?:\s*[–-]\s*\d+[A-Za-z]?)?\s+/, "")
      .trim() || line;

  let city = "";
  for (let i = 1; i < segments.length; i++) {
    const part = segments[i] ?? "";
    if (!part) continue;
    if (isCountry(part) || isRegion(part)) continue;
    if (parsePostalCode(part)) continue;
    city = part;
    break;
  }

  const publicStreet = abbreviatePlaceName(street);
  if (city && fold(city) !== fold(street)) {
    return `${publicStreet}, ${abbreviatePlaceName(city)}`;
  }

  return publicStreet;
}

export function mergeAddressParts(
  ...chunks: Array<AddressParts | undefined>
): AddressParts {
  const merged: AddressParts = {};
  for (const chunk of chunks) {
    if (!chunk) continue;
    if (chunk.unit?.trim()) merged.unit = chunk.unit.trim();
    if (chunk.city?.trim()) merged.city = chunk.city.trim();
    if (chunk.region?.trim()) merged.region = normalizeRegion(chunk.region);
    if (chunk.postalCode?.trim()) {
      merged.postalCode = formatPostalCode(chunk.postalCode);
    }
    if (chunk.country?.trim()) merged.country = chunk.country.trim();
  }
  if (!merged.country) merged.country = "Canada";
  return merged;
}
