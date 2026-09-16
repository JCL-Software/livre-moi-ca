"use client";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  HowItWorksProfilePanel,
  type HowItWorksProfile,
} from "@/components/marketing/how-it-works-profile-panel";
import { SectionHeader } from "@/components/marketing/section-header";

const PASSENGER: HowItWorksProfile = {
  heading: "Je cherche une place",
  intro:
    "Trouvez un trajet déjà prévu entre les villes du Québec et de l'Ontario, consultez les conditions, puis réservez votre siège en toute clarté.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Passager Livre-moi.ca recherchant un covoiturage",
  items: [
    "Recherchez un trajet selon départ, destination et date",
    "Consultez le profil, les avis et les conditions",
    "Réservez votre place dans l'application",
    "Rejoignez le point de rencontre convenu",
    "Confirmez votre arrivée pour clôturer le trajet",
  ],
  ctaLabel: "Trouver une place",
  ctaHref: "/recherche?type=PASSENGER",
};

const DRIVER: HowItWorksProfile = {
  heading: "Je propose un trajet",
  intro:
    "Publiez un déplacement que vous aviez déjà prévu, indiquez vos places libres et partagez les frais avec des passagers du Québec et de l’Ontario.",
  imageSrc: "/brand/axio-conducteur-voiture.png",
  imageAlt: "Conducteur Livre-moi.ca prêt à partager son trajet",
  imageFit: "cover",
  items: [
    "Publiez un trajet déjà prévu",
    "Indiquez les places et l'espace bagages disponibles",
    "Consultez les demandes de passagers",
    "Confirmez les places et le point de rencontre",
    "Effectuez le trajet. Le paiement se fait en ligne.",
  ],
  ctaLabel: "Proposer un trajet",
  ctaHref: "/trajets/nouveau",
};

export function CarpoolHowItWorksSection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Comment ça fonctionne"
          subtitle="Deux parcours distincts : trouver une place ou partager les sièges d'un trajet déjà prévu."
        />

        <AnimatedTabs
          tabs={[
            {
              title: "Je cherche une place",
              value: "passenger",
              content: <HowItWorksProfilePanel {...PASSENGER} />,
            },
            {
              title: "Je propose un trajet",
              value: "driver",
              content: <HowItWorksProfilePanel {...DRIVER} />,
            },
          ]}
          containerClassName="mx-auto grid w-full max-w-xl grid-cols-2 justify-center gap-1.5 overflow-visible rounded-lg bg-[#F6F6F6] p-1.5 dark:bg-neutral-900"
          tabClassName="w-full rounded-md px-3 py-2.5 text-center text-sm font-medium sm:text-[15px]"
          activeTabClassName="rounded-md"
          layoutId="how-it-works-covoiturage-tab"
        />
      </div>
    </section>
  );
}
