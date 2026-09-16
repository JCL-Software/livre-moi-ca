"use client";

import { buildMapboxStaticImageUrl } from "@livre-moi/shared/geo";
import { cn } from "@/lib/utils";

type StaticMapImageProps = {
  className?: string;
  lng?: number;
  lat?: number;
  zoom?: number;
  width?: number;
  height?: number;
  alt?: string;
};

/** Carte Static Images (quota 50k, cache navigateur) — pas de Map Load GL. */
export function StaticMapImage({
  className,
  lng = -73.5673,
  lat = 45.5017,
  zoom = 10,
  width = 640,
  height = 840,
  alt = "Carte",
}: StaticMapImageProps) {
  const url = buildMapboxStaticImageUrl({
    lng,
    lat,
    zoom,
    width,
    height,
    retina: false,
  });

  if (!url) {
    return <div className={cn("h-full w-full bg-[#e8eef4]", className)} aria-hidden />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- URL Mapbox dynamique (token)
    <img
      src={url}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}
