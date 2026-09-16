"use client";

import { Navigation } from "lucide-react";
import { MessageCircle } from "@/components/animate-ui/icons/message-circle";
import { StaticMapImage } from "@/components/maps/static-map-image";

/**
 * Maquette marketing TrustJourney — image Static Mapbox uniquement.
 * Évite les Map Loads GL (remounts de la boucle TrustJourney).
 */
export function LiveTrackingScreen() {
  return (
    <div className="relative h-full overflow-hidden bg-[#e8eef4] text-slate-900">
      <div className="absolute inset-0">
        <StaticMapImage
          width={400}
          height={700}
          zoom={10}
          alt="Suivi en direct"
        />
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
