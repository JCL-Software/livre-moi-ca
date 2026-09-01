"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { CorridorRoutesMapDynamic } from "@/components/maps/corridor-routes-map-dynamic";
import { SectionHeader } from "@/components/marketing/section-header";
import { POPULAR_CARPOOL_ROUTES } from "@/lib/constants";
import { buildSearchUrl } from "@/lib/carpool-routes";
import { cn } from "@/lib/utils";

export function CarpoolRoutesSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Corridors populaires"
        title="Les corridors les plus empruntés"
        subtitle="Des départs réguliers chaque semaine. Survolez un trajet sur la carte ou sélectionnez une carte pour le mettre en évidence."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <MapPinned className="h-4 w-4 text-orange-500" />
            Route 117 · Abitibi ↔ grands centres
          </div>
          <div className="h-[320px] p-2 md:h-[420px]">
            <CorridorRoutesMapDynamic
              routes={POPULAR_CARPOOL_ROUTES}
              selectedIndex={selectedIndex}
              onSelectRoute={setSelectedIndex}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {POPULAR_CARPOOL_ROUTES.map((route, index) => {
            const isActive = selectedIndex === index;
            return (
              <Link
                key={route.label}
                href={buildSearchUrl(route.origin, route.destination)}
                onMouseEnter={() => setSelectedIndex(index)}
                onFocus={() => setSelectedIndex(index)}
                className={cn(
                  "group feature-card flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all dark:bg-slate-900",
                  isActive
                    ? "border-orange-400 ring-2 ring-orange-400/30 dark:border-orange-500"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                <h3 className="font-space text-lg font-bold text-slate-950 dark:text-white">
                  {route.label}
                </h3>
                {route.via && (
                  <p className="mt-1 text-sm text-muted-foreground">{route.via}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-orange-600 dark:text-orange-400">
                    Dès {route.priceFrom}&nbsp;$
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors group-hover:text-orange-600 dark:text-slate-400">
                    Rechercher
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
