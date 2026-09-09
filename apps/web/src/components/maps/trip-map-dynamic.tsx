"use client";

import dynamic from "next/dynamic";

export const TripMapDynamic = dynamic(() => import("@/components/maps/trip-map"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[280px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
      Chargement de la carte…
    </div>
  ),
});
