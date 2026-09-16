import { MAPBOX_STYLE_DEFAULT } from "@livre-moi/shared/geo";
import { getMapboxPublicToken } from "@livre-moi/shared/env";

export const MAPBOX_ATTRIBUTION = "© Mapbox © OpenStreetMap";

export function getWebMapboxToken() {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ?? "";
  if (
    token.length >= 20 &&
    (token.startsWith("pk.") || token.startsWith("tk."))
  ) {
    return token;
  }
  return getMapboxPublicToken();
}

/** Kill switch local : `NEXT_PUBLIC_MAPBOX_GL_ENABLED=false` → aucune carte interactive. */
export function isMapboxGlEnabled() {
  const flag = process.env.NEXT_PUBLIC_MAPBOX_GL_ENABLED?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off") return false;
  return true;
}

export function getWebMapboxStyle() {
  return MAPBOX_STYLE_DEFAULT;
}
