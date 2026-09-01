"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Car,
  Download,
  MapPinned,
  Package,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type HeroMode = "colis" | "covoiturage";

const modes: { id: HeroMode; label: string; icon: typeof Package }[] = [
  { id: "colis", label: "Transport de colis", icon: Package },
  { id: "covoiturage", label: "Covoiturage", icon: Car },
];

export function HeroSection() {
  const [mode, setMode] = useState<HeroMode>("colis");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f]">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/10" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <div
            className="flex justify-center md:justify-start"
            role="tablist"
            aria-label="Type de service"
          >
            <div className="inline-flex rounded-xl bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-sm">
              {modes.map(({ id, label, icon: Icon }) => {
                const active = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMode(id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition-all duration-200 sm:px-5 sm:text-base",
                      active
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                        : "text-orange-100 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {mode === "colis" ? (
              <>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-orange-200 ring-1 ring-white/15">
                  <MapPinned className="h-4 w-4" />
                  Abitibi-Témiscamingue · Cotransportage
                </p>
                <div className="space-y-4">
                  <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Envoyez ou livrez des colis entre villes facilement
                  </h1>
                  <p className="max-w-xl text-lg font-semibold leading-8 text-orange-100 sm:text-xl">
                    Avec {APP_NAME}, chaque trajet compte. Livraison rapide, simple et
                    écologique — avec preuve OTP à la remise.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/recherche?type=PARCEL"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    Envoyer un colis
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/trajets/nouveau"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    Livrer et gagner
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/recherche"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-base font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    <Download className="h-5 w-5 shrink-0" />
                    Télécharger l&apos;app
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-orange-200 ring-1 ring-white/15">
                  <MapPinned className="h-4 w-4" />
                  Abitibi-Témiscamingue · Route 117
                </p>
                <div className="space-y-4">
                  <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Covoiturage régional
                    <span className="text-orange-400"> · {APP_NAME}</span>
                  </h1>
                  <p className="max-w-xl text-lg font-semibold leading-8 text-orange-100 sm:text-xl">
                    Partagez la route, réduisez les coûts. Places passagers sur le corridor
                    Val-d&apos;Or, Amos, Rouyn-Noranda, Mont-Laurier et Montréal — matching
                    spatial à 25 km.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/trajets/nouveau"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    Publier un trajet
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/recherche?type=PASSENGER"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
                  >
                    Voir les départs
                  </Link>
                </div>
              </>
            )}
        </div>

        <div className="fade-in-right relative mt-4 flex justify-center md:mt-0 md:justify-end">
          <Image
            src={mode === "colis" ? "/brand/axio-colis.png" : "/brand/axio-covoiturage.png"}
            alt={
              mode === "colis"
                ? "Axio — livreur Livre-moi.ca avec un colis"
                : "Axio — passager Livre-moi.ca sur son téléphone"
            }
            width={mode === "colis" ? 495 : 496}
            height={mode === "colis" ? 504 : 503}
            priority
            className="relative h-auto w-full max-w-[280px] object-contain drop-shadow-2xl sm:max-w-[360px] lg:max-w-[440px]"
          />
        </div>
      </div>
    </section>
  );
}
