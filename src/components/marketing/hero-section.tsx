"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceModeToggle } from "@/components/layout/service-mode-toggle";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";
import { APP_NAME } from "@/lib/constants";

export function HeroSection() {
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

          <div className="space-y-4">
            <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Envoyez ou livrez des colis entre villes facilement
            </h1>
            <HeroSubtitle>
              Avec {APP_NAME}, chaque trajet compte. Livraison rapide, simple et
              écologique — avec preuve OTP à la remise.
            </HeroSubtitle>
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
              href="/livrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              Livrer et gagner
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="fade-in-right relative mt-4 flex justify-center md:mt-0 md:justify-end">
          <Image
            src="/brand/axio-colis.png"
            alt="Axio — livreur Livre-moi.ca avec un colis"
            width={495}
            height={504}
            priority
            className="relative h-auto w-full max-w-[280px] object-contain drop-shadow-2xl sm:max-w-[360px] lg:max-w-[440px]"
          />
        </div>
      </div>
    </section>
  );
}
