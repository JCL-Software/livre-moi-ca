"use client";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  HowItWorksProfilePanel,
  type HowItWorksProfile,
} from "@/components/marketing/how-it-works-profile-panel";
import { SectionHeader } from "@/components/marketing/section-header";

const PARTICULIER_EXPEDITEUR: HowItWorksProfile = {
  heading: "Vous avez un colis à faire parvenir ?",
  intro:
    "Un achat Marketplace, une pièce urgente, des clés oubliées ou un objet à envoyer à un proche : publiez votre annonce. Elle est publique : les conducteurs vous proposent un tarif, puis vous choisissez.",
  imageSrc: "/brand/axio-colis.png",
  imageAlt: "Conducteur Livre-moi.ca prêt à transporter un colis",
  items: [
    "Publiez votre annonce (départ, destination, format)",
    "Recevez les propositions des conducteurs",
    "Choisissez l’offre qui vous convient",
    "Organisez le point de rencontre",
    "Confirmez la livraison avec un code sécurisé",
  ],
  ctaLabel: "Publier un colis",
  ctaHref: "/colis/nouveau",
};

const PARTICULIER_CONDUCTEUR: HowItWorksProfile = {
  heading: "Vous prenez déjà la route ?",
  intro:
    "Les annonces de colis sont publiques. Parcourez-les ou publiez votre trajet, proposez un tarif, et l’expéditeur vous choisit.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Conducteur Livre-moi.ca prêt à prendre la route",
  items: [
    "Publiez votre trajet ou ouvrez les colis disponibles",
    "Proposez un tarif sur les colis qui correspondent à votre route",
    "L’expéditeur choisit l’offre qui lui convient",
    "Organisez la remise avec l’expéditeur",
    "Confirmez la livraison avec un code",
  ],
  ctaLabel: "Publier un trajet",
  ctaHref: "/trajets/nouveau",
};

const COMMERCE_EXPEDITEUR: HowItWorksProfile = {
  heading: "Vos clients sont dans une autre ville ?",
  intro:
    "Livre-moi.ca aide les petits commerces et les vendeurs indépendants à faire parvenir leurs produits sans devoir créer leur propre réseau de livraison.",
  imageSrc: "/brand/axio-commerce.png",
  imageAlt: "Livreur Livre-moi.ca tenant un colis dans un entrepôt",
  imageFit: "cover",
  items: [
    "Rejoignez davantage de clients",
    "Expédiez des produits entre les villes",
    "Évitez les déplacements dédiés",
    "Coordonnez facilement les remises",
    "Offrez une solution locale et flexible",
  ],
  ctaLabel: "Découvrir la solution pour les commerces",
  ctaHref: "/colis/nouveau",
};

const CONDUCTEUR_REGULIER: HowItWorksProfile = {
  heading: "Vous faites souvent le même trajet ?",
  intro:
    "Vous faites régulièrement le même trajet pour le travail, les études ou vos activités personnelles ? Profitez de l'espace disponible dans votre véhicule pour transporter des colis et générer un revenu supplémentaire.",
  introClassName: "max-w-xl",
  imageSrc: "/brand/axio-conducteur-voiture.png",
  imageAlt: "Conducteur régulier Livre-moi.ca consultant l'application depuis sa voiture",
  imageFit: "cover",
  items: [
    "Créez un trajet récurrent",
    "Indiquez vos villes de passage",
    "Choisissez les formats acceptés",
    "Évitez les détours inutiles",
    "Optimisez vos déplacements réguliers",
  ],
  ctaLabel: "Créer un trajet régulier",
  ctaHref: "/trajets/nouveau",
};

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="section-plain scroll-mt-20 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
      <SectionHeader
        badge="Pour qui ?"
        title="Livre-moi.ca s'adapte à tous les profils"
        subtitle="Une façon simple, humaine et concrète de faire voyager un colis sur un trajet déjà prévu."
      />

      <AnimatedTabs
        tabs={[
          {
            title: "Particulier expéditeur",
            value: "sender",
            content: <HowItWorksProfilePanel {...PARTICULIER_EXPEDITEUR} />,
          },
          {
            title: "Particulier conducteur",
            value: "driver",
            content: <HowItWorksProfilePanel {...PARTICULIER_CONDUCTEUR} />,
          },
          {
            title: "Commerce expéditeur",
            value: "business",
            content: <HowItWorksProfilePanel {...COMMERCE_EXPEDITEUR} />,
          },
          {
            title: "Conducteur régulier",
            value: "regular",
            content: <HowItWorksProfilePanel {...CONDUCTEUR_REGULIER} />,
          },
        ]}
        containerClassName="mx-auto grid w-full max-w-4xl grid-cols-2 justify-center gap-1.5 overflow-visible rounded-lg bg-[#F6F6F6] p-1.5 dark:bg-neutral-900 lg:grid-cols-4"
        tabClassName="w-full rounded-md px-3 py-2.5 text-center text-sm font-medium sm:text-[15px]"
        activeTabClassName="rounded-md"
        layoutId="how-it-works-colis-tab"
      />
      </div>
    </section>
  );
}
