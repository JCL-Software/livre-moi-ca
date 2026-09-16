"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";
import { SearchForm } from "@/components/search/search-form";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";

export function CarpoolHeroSection() {
  return (
    <section className="section-muted relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="black"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.04),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06),_transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 md:pb-16 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="fade-in-left space-y-8">
            <p className="uber-home-kicker">
              Covoiturage régional au Québec et en Ontario
            </p>

            <div className="space-y-4">
              <h1 className="uber-home-title">
                Votre trajet est déjà prévu. Partagez-le simplement.
              </h1>
              <HeroSubtitle>
                Trouvez une place dans un véhicule qui se dirige déjà vers votre
                destination ou proposez les places libres de votre trajet.
                Livre-moi.ca facilite la mise en relation entre passagers et
                conducteurs vérifiés.
              </HeroSubtitle>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/recherche?type=PASSENGER" className="btn-brand">
                Trouver une place
                <ArrowRight className="h-5 w-5" size={20} animateOnHover />
              </Link>
              <MovingBorderButton
                as={Link}
                href="/covoiturage/proposer"
                borderRadius="0.5rem"
                duration={5000}
                containerClassName="h-[52px] w-full p-[1px] text-base sm:w-auto"
                borderClassName="h-16 w-16 bg-[radial-gradient(#000000_40%,transparent_60%)] opacity-50"
                className="border-neutral-200 bg-white px-6 text-base font-medium text-black hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
              >
                <span className="inline-flex items-center gap-2">
                  Proposer un trajet
                  <ArrowRight className="h-5 w-5" size={20} animateOnHover />
                </span>
              </MovingBorderButton>
            </div>
          </div>

          <div className="fade-in-right relative flex justify-center md:justify-end">
            <div className="flex w-full max-w-[440px] items-end justify-center px-4 pt-8">
              <Image
                src="/brand/axio-covoiturage.png"
                alt="Passager Livre-moi.ca sur son téléphone"
                width={496}
                height={503}
                priority
                className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[360px]"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 md:mt-12">
          <SearchForm
            defaultType="PASSENGER"
            showTypeToggle={false}
            passengerExtras={false}
            compact
            submitLabel="Rechercher"
          />
        </div>
      </div>
    </section>
  );
}
