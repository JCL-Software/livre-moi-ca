"use client";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  HowItWorksProfilePanel,
  type HowItWorksProfile,
} from "@/components/marketing/how-it-works-profile-panel";
import { SectionHeader } from "@/components/marketing/section-header";

const PARTICULIER_EXPEDITEUR: HowItWorksProfile = {
  heading: "Vous avez un colis à faire parvenir?",
  intro:
    "Un achat Marketplace, une pièce urgente, des clés oubliées ou un objet à envoyer à un proche : publiez votre demande et trouvez un conducteur qui se dirige déjà vers votre destination.",
  imageSrc: "/brand/axio-colis.png",
  imageAlt: "Conducteur Livre-moi.ca prêt à transporter un colis",
  items: [
    "Indiquez le lieu de départ et la destination",
    "Choisissez le format du colis",
    "Sélectionnez une date souhaitée",
    "Discutez du point de rencontre",
    "Confirmez la livraison avec un code sécurisé",
  ],
  ctaLabel: "Publier un colis",
  ctaHref: "/recherche?type=PARCEL",
};

const PARTICULIER_CONDUCTEUR: HowItWorksProfile = {
  heading: "Vous prenez déjà la route?",
  intro:
    "Transformez l'espace disponible dans votre véhicule en occasion de rendre service et de réduire le coût de votre trajet.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Conducteur Livre-moi.ca prêt à prendre la route",
  items: [
    "Publiez votre trajet",
    "Indiquez l'espace disponible",
    "Acceptez un colis qui correspond à votre route",
    "Organisez la remise avec l'expéditeur",
    "Recevez votre paiement après confirmation",
  ],
  ctaLabel: "Publier un trajet",
  ctaHref: "/trajets/nouveau",
};

const COMMERCE_EXPEDITEUR: HowItWorksProfile = {
  heading: "Vos clients sont dans une autre ville?",
  intro:
    "Livre-moi.ca aide les petits commerces et les vendeurs indépendants à faire parvenir leurs produits sans devoir créer leur propre réseau de livraison.",
  imageSrc: "/brand/axio-commerce.jpg",
  imageAlt: "Livreur Livre-moi.ca récupérant un colis dans un commerce",
  imageFit: "cover",
  items: [
    "Rejoignez davantage de clients",
    "Expédiez des produits entre les villes",
    "Évitez les déplacements dédiés",
    "Coordonnez facilement les remises",
    "Offrez une solution locale et flexible",
  ],
  ctaLabel: "Découvrir la solution pour les commerces",
  ctaHref: "/recherche?type=PARCEL",
};

const CONDUCTEUR_REGULIER: HowItWorksProfile = {
  heading: "Vous faites souvent le même trajet?",
  intro:
    "Vous faites régulièrement le même trajet pour le travail, les études ou vos activités personnelles? Profitez de l'espace disponible dans votre véhicule pour transporter des colis et générer un revenu supplémentaire.",
  imageSrc: "/brand/axio-conducteur-regulier.png",
  imageAlt: "Conducteur régulier Livre-moi.ca consultant son trajet",
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
    <section
      id="fonctionnement"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:py-20"
    >
      <SectionHeader
        badge="Pour qui?"
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
        containerClassName="mx-auto grid w-full max-w-4xl grid-cols-2 justify-center gap-2 overflow-visible rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-4"
        tabClassName="w-full rounded-xl px-3 py-2.5 text-center text-sm font-bold sm:text-[15px]"
        activeTabClassName="rounded-xl"
        layoutId="how-it-works-colis-tab"
      />
    </section>
  );
}
