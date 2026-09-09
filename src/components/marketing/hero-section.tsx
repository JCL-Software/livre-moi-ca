import Image from "next/image";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";

export function HeroSection() {
  return (
    <section className="section-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <p className="text-sm font-medium text-neutral-500">
            Livraison collaborative
          </p>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-6xl dark:text-white">
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
              <Link href="/recherche?type=PARCEL" className="btn-brand">
                Trouver un trajet
                <ArrowRight className="h-5 w-5" size={20} animateOnHover />
              </Link>
              <Link href="#estimation" className="btn-brand-secondary">
                <Calculator className="h-5 w-5 shrink-0" />
                Estimer le coût d&apos;un colis
              </Link>
            </div>
            <p className="text-sm text-neutral-500">
              Des trajets réels entre des personnes d&apos;ici.
            </p>
          </div>
        </div>

        <div className="fade-in-right relative mt-4 flex justify-center md:mt-0 md:justify-end">
          <div className="flex w-full max-w-[440px] items-end justify-center rounded-xl bg-[#F6F6F6] px-4 pt-8 dark:bg-neutral-900">
            <Image
              src="/brand/axio-colis.png"
              alt="Conducteur Livre-moi.ca prêt à transporter un colis"
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
