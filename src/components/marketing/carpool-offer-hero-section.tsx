"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceModeToggle } from "@/components/layout/service-mode-toggle";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";

export function CarpoolOfferHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f]">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-sky-300/15 blur-3xl" />
        <div className="absolute inset-0 bg-slate-950/10" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <div className="flex justify-center md:justify-start">
            <ServiceModeToggle variant="hero" />
          </div>

          <p className="text-sm font-bold uppercase tracking-wider text-orange-300">
            Proposer un covoiturage
          </p>

          <div className="space-y-4">
            <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Vous roulez déjà ? Partagez vos places libres et réduisez vos frais.
            </h1>
            <HeroSubtitle>
              Proposez les sièges vides de votre véhicule sur les trajets que vous
              planifiez déjà entre les villes de la région ou vers Montréal et Gatineau.
            </HeroSubtitle>
          </div>

          <Link
            href="/trajets/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Proposer des places libres
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="fade-in-right relative flex justify-center md:justify-end">
          <Image
            src="/brand/axio-covoiturage.png"
            alt="Conducteur Livre-moi.ca proposant des places en covoiturage"
            width={496}
            height={503}
            priority
            className="relative h-auto w-full max-w-[280px] object-contain drop-shadow-2xl sm:max-w-[360px] lg:max-w-[440px]"
          />
        </div>
      </div>
    </section>
  );
}
