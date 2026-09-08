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
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
      <SectionHeader
        badge="Corridors populaires"
        title="Les corridors les plus empruntés"
        subtitle="Des départs réguliers chaque semaine. Survolez un trajet sur la carte ou sélectionnez une carte pour le mettre en évidence."
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div className="flex items-center gap-2 border-b border-neutral-200 bg-[#F6F6F6] px-4 py-3 text-sm font-medium text-neutral-600 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400">
            <MapPinned className="h-4 w-4 text-black dark:text-white" />
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
                  "group feature-card flex flex-col rounded-lg border bg-white p-5 shadow-sm transition-all dark:bg-neutral-900",
                  isActive
                    ? "border-black ring-2 ring-black/10 dark:border-white dark:ring-white/20"
                    : "border-neutral-200 dark:border-white/10",
                )}
              >
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {route.label}
                </h3>
                {route.via && (
                  <p className="mt-1 text-sm text-muted-foreground">{route.via}</p>
                )}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-black dark:text-white">
                    Dès {route.priceFrom}&nbsp;$
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-600 transition-colors group-hover:text-black dark:text-neutral-400 dark:group-hover:text-white">
                    Rechercher
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
