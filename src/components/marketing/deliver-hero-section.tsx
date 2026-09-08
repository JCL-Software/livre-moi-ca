import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";

export function DeliverHeroSection() {
  return (
    <section className="section-plain">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <p className="text-sm font-medium text-neutral-500">
            Livrer avec Livre-moi.ca
          </p>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl dark:text-white">
              Vous faites déjà le trajet ? Rentabilisez l&apos;espace dans votre véhicule.
            </h1>
            <HeroSubtitle>
              Transportez des colis sur les déplacements que vous planifiez déjà. Aucun détour
              inutile sur la route 117 ou entre nos villes.
            </HeroSubtitle>
          </div>

          <Link href="/trajets/nouveau" className="btn-brand">
            Publier mon trajet
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="fade-in-right relative flex justify-center md:justify-end">
          <div className="flex w-full max-w-[440px] items-end justify-center rounded-xl bg-[#F6F6F6] px-4 pt-8 dark:bg-neutral-900">
            <Image
              src="/brand/axio-colis.png"
              alt="Conducteur Livre-moi.ca avec un colis dans le coffre"
              width={495}
              height={504}
              priority
              className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[360px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
