import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { HeroSubtitle } from "@/components/marketing/hero-subtitle";

export function CarpoolOfferHeroSection() {
  return (
    <section className="section-plain">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pt-20">
        <div className="fade-in-left space-y-8">
          <p className="uber-home-kicker">
            Proposer un covoiturage
          </p>

          <div className="space-y-4">
            <h1 className="uber-home-title">
              Vous roulez déjà ? Partagez vos places libres et réduisez vos frais.
            </h1>
            <HeroSubtitle>
              Proposez les sièges vides de votre véhicule sur les trajets que vous
              planifiez déjà, entre les villes du Québec et de l’Ontario.
            </HeroSubtitle>
          </div>

          <Link href="/trajets/nouveau" className="btn-brand">
            Proposer des places libres
            <ArrowRight className="h-5 w-5" size={20} animateOnHover />
          </Link>
        </div>

        <div className="fade-in-right relative flex justify-center md:justify-end">
          <div className="flex w-full max-w-[440px] items-end justify-center rounded-xl bg-[#F6F6F6] px-4 pt-8 dark:bg-neutral-900">
            <Image
              src="/brand/axio-covoiturage.png"
              alt="Conducteur Livre-moi.ca proposant des places en covoiturage"
              width={496}
              height={503}
              priority
              className="relative h-auto w-full max-w-[280px] object-contain sm:max-w-[360px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
