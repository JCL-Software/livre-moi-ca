"use client";

import dynamic from "next/dynamic";

export const EstimateMapDynamic = dynamic(
  () => import("@/components/maps/estimate-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[360px] items-center justify-center bg-[#F6F6F6] text-sm text-neutral-500 dark:bg-neutral-900">
        Chargement de la carte…
      </div>
    ),
  },
);
