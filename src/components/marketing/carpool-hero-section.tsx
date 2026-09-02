"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceModeToggle } from "@/components/layout/service-mode-toggle";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";
import { SearchForm } from "@/components/search/search-form";

export function CarpoolHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f]">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/10" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="fade-in-left space-y-8">
            <div className="flex justify-center md:justify-start">
              <ServiceModeToggle variant="hero" />
            </div>

            <div className="space-y-4">
              <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Le covoiturage simple et économique
              </h1>
              <HeroSubtitle>
                Partagez la route, réduisez vos frais d&apos;essence et voyagez en
                toute sécurité entre vos villes préférées et vers Montréal ou Gatineau.
              </HeroSubtitle>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/recherche?type=PASSENGER"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Trouver un covoiturage
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/covoiturage/proposer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
              >
                Proposer des places libres
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="fade-in-right relative flex justify-center md:justify-end">
            <Image
              src="/brand/axio-covoiturage.png"
              alt="Axio — passager Livre-moi.ca sur son téléphone"
              width={496}
              height={503}
              priority
              className="relative h-auto w-full max-w-[280px] object-contain drop-shadow-2xl sm:max-w-[360px] lg:max-w-[440px]"
            />
          </div>
        </div>

        <div className="mt-10 md:mt-12">
          <SearchForm
            defaultType="PASSENGER"
            showTypeToggle={false}
            passengerExtras
            compact
            submitLabel="Rechercher un trajet"
          />
        </div>
      </div>
    </section>
  );
}
