import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";
import { SearchForm } from "@/components/search/search-form";

export function CarpoolHeroSection() {
  return (
    <section className="section-plain">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="fade-in-left space-y-8">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500">
              <MapPinned className="h-4 w-4" />
              Québec · Ontario
            </p>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl dark:text-white">
                Le covoiturage simple, économique et fiable
              </h1>
              <HeroSubtitle>
                Partagez la route, réduisez vos frais d&apos;essence et voyagez en
                toute sécurité entre vos villes et vers l&apos;Ontario.
              </HeroSubtitle>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/recherche?type=PASSENGER" className="btn-brand">
                Trouver un covoiturage
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/covoiturage/proposer" className="btn-brand-secondary">
                Proposer des places libres
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="fade-in-right relative flex justify-center md:justify-end">
            <div className="flex w-full max-w-[440px] items-end justify-center rounded-xl bg-[#F6F6F6] px-4 pt-8 dark:bg-neutral-900">
              <Image
                src="/brand/axio-covoiturage.png"
                alt="Axio — Passager Livre-moi.ca sur son téléphone"
                width={496}
                height={503}
                priority
                className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[360px]"
              />
            </div>
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
