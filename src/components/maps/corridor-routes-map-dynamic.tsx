"use client";

import dynamic from "next/dynamic";

export const CorridorRoutesMapDynamic = dynamic(
  () => import("@/components/maps/corridor-routes-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900">
        Chargement de la carte…
      </div>
    ),
  },
);
