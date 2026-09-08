import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";

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
          <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-orange-200 ring-1 ring-white/15">
            Livraison collaborative
          </p>

          <div className="space-y-4">
            <h1 className="font-space text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Votre colis voyage déjà avec quelqu&apos;un
            </h1>
            <HeroSubtitle>
              Faites livrer vos colis entre les villes du Québec et de l&apos;Ontario
              grâce à des conducteurs qui prennent déjà la route. Une solution simple,
              humaine et pratique pour envoyer ce qui compte, sans détour inutile.
            </HeroSubtitle>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/recherche?type=PARCEL"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                Trouver un trajet
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#estimation"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-base font-extrabold text-slate-950 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
              >
                <Calculator className="h-5 w-5 shrink-0" />
                Estimer le coût d&apos;un colis
              </Link>
            </div>
            <p className="text-sm font-medium text-orange-100/90">
              Des trajets réels entre des personnes d&apos;ici.
            </p>
          </div>
        </div>

        <div className="fade-in-right relative mt-4 flex justify-center md:mt-0 md:justify-end">
          <Image
            src="/brand/axio-colis.png"
            alt="Conducteur Livre-moi.ca prêt à transporter un colis"
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
