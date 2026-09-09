"use client";

import { useEffect, useState } from "react";
import { Navigation } from "lucide-react";
import { MessageCircle } from "@/components/animate-ui/icons/message-circle";
import { LiveTrackingMapDynamic } from "@/components/marketing/live-tracking-map-dynamic";
import {
  LIVE_TRACKING_ROUTES,
  pickNextRouteIndex,
} from "@/lib/live-tracking-routes";

export function LiveTrackingScreen() {
  const [routeIndex, setRouteIndex] = useState(0);
  const route = LIVE_TRACKING_ROUTES[routeIndex];

  useEffect(() => {
    const id = window.setInterval(() => {
      setRouteIndex((current) => pickNextRouteIndex(current));
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative h-full overflow-hidden bg-[#e8eaed] text-slate-900">
      <div className="absolute inset-0">
        <LiveTrackingMapDynamic activeRouteId={route.id} />
      </div>

      <div className="absolute bottom-[4.5rem] left-2 z-[1000] flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-md ring-1 ring-black/5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1a73e8] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1a73e8]" />
        </span>
        Conducteur
      </div>

      <div className="absolute inset-x-2 bottom-5 z-[1000] flex items-center justify-between gap-1 rounded-2xl bg-white/95 px-2 py-2 shadow-lg shadow-slate-900/15 ring-1 ring-black/5">
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-700">
          <Navigation className="h-3 w-3 text-[#1a73e8]" />
          En route
        </div>
        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
          <MessageCircle className="h-3 w-3 text-orange-500" size={12} animateOnHover />
          Chat
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Code
        </span>
      </div>
    </div>
  );
}
