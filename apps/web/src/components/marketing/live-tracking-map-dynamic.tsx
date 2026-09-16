"use client";

import dynamic from "next/dynamic";

export const LiveTrackingMapDynamic = dynamic(
  () => import("@/components/marketing/live-tracking-map"),
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-[#e8eef4]" />,
  },
);
