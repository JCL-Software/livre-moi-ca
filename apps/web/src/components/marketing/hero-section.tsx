import Image from "next/image";
import Link from "next/link";
import { Calculator } from "lucide-react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { WhereToSearch } from "@/components/ux-lab/where-to-search";

export function HeroSection() {
  return (
    <section className="section-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <p className="uber-home-kicker">
            Livraison collaborative
          </p>

          <div className="space-y-4">
            <h1 className="uber-home-title">
              Votre colis voyage déjà avec quelqu&apos;un
            </h1>
            <HeroSubtitle>
              Faites livrer vos colis entre les villes du Québec et de l&apos;Ontario
              grâce à des conducteurs qui prennent déjà la route. Une solution simple,
              humaine et pratique pour envoyer ce qui compte, sans détour inutile.
            </HeroSubtitle>
          </div>

          <div className="space-y-3">
            <WhereToSearch />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/recherche?type=PARCEL" className="btn-brand">
                Trouver un trajet
                <ArrowRight className="h-5 w-5" size={20} animateOnHover />
              </Link>
              <MovingBorderButton
                as="a"
                href="/calculateur"
                borderRadius="0.5rem"
                duration={5000}
                containerClassName="h-[52px] w-full p-[1px] text-base sm:w-auto"
                borderClassName="h-16 w-16 bg-[radial-gradient(#000000_40%,transparent_60%)] opacity-50"
                className="border-neutral-200 bg-white px-6 text-base font-medium text-black hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
              >
                <span className="inline-flex items-center gap-2">
                  <Calculator className="h-5 w-5 shrink-0" />
                  Estimer le coût d&apos;un colis
                </span>
              </MovingBorderButton>
            </div>
            <p className="text-sm text-neutral-500">
              Livre-moi.ca met en relation les personnes qui souhaitent faire
              transporter
              <br />
              un colis avec des conducteurs qui prennent déjà la route.
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
