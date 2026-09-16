import { getSupabaseUrl } from "@livre-moi/shared/env";

export const PARCEL_LISTING_PHOTO_BUCKET = "parcel-listings";
export const PARCEL_PHOTO_MAX_BYTES = 8 * 1024 * 1024;

export function parcelListingPhotoUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = getSupabaseUrl().replace(/\/$/, "");
  if (!base) return null;
  return `${base}/storage/v1/object/public/${PARCEL_LISTING_PHOTO_BUCKET}/${path}`;
}

export function parcelPhotoExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (fromName === "jpeg") return "jpg";
  if (["jpg", "png", "webp", "heic", "heif"].includes(fromName)) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}
