import { MAPBOX_STYLE_STATIC } from "./map-style";
import { getMapboxPublicToken } from "../env";

export function buildMapboxStaticImageUrl(input: {
  lng: number;
  lat: number;
  zoom?: number;
  width?: number;
  height?: number;
  /** @2x consomme plus ; désactiver pour les maquettes marketing. */
  retina?: boolean;
}): string | null {
  const token = getMapboxPublicToken();
  if (!token) return null;
  const zoom = input.zoom ?? 10;
  const width = Math.min(1280, input.width ?? 640);
  const height = Math.min(1280, input.height ?? 840);
  const scale = input.retina === false ? "" : "@2x";
  return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE_STATIC}/static/${input.lng},${input.lat},${zoom},0/${width}x${height}${scale}?access_token=${token}`;
}
