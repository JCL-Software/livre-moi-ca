"use client";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  HowItWorksProfilePanel,
  type HowItWorksProfile,
} from "@/components/marketing/how-it-works-profile-panel";
import { SectionHeader } from "@/components/marketing/section-header";

const PROFILE: HowItWorksProfile = {
  heading: "Créer son profil",
  intro:
    "Le conducteur renseigne ses informations de base et commence à construire un profil lisible pour la communauté.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Profil conducteur Livre-moi.ca",
  items: [
    "Renseigner les informations essentielles",
    "Ajouter une photo de profil",
    "Préparer la suite de la vérification",
  ],
  ctaLabel: "Créer mon profil",
  ctaHref: "/inscription",
};

const IDENTITY: HowItWorksProfile = {
  heading: "Confirmer son identité",
  intro:
    "Une vérification d'identité permet de mieux connaître la personne qui propose des places avant le premier départ.",
  imageSrc: "/brand/axio-verification-identite.png",
  imageAlt: "Vérification d'identité Livre-moi.ca",
  items: [
    "Soumettre les documents demandés",
    "Confirmer son identité via le processus intégré",
    "Attendre la validation avant d'accueillir des passagers",
  ],
  ctaLabel: "Vérifier mon identité",
  ctaHref: "/compte/identite",
};

const VEHICLE: HowItWorksProfile = {
  heading: "Ajouter le véhicule",
  intro:
    "Modèle, couleur et informations utiles sont ajoutées au profil pour que les passagers sachent à quoi s'attendre.",
  imageSrc: "/brand/axio-verification-vehicule.png",
  imageAlt: "Informations véhicule Livre-moi.ca",
  imageFit: "cover",
  items: [
    "Indiquer les informations du véhicule",
    "Préciser le nombre de places",
    "Décrire l'espace bagages disponible",
  ],
  ctaLabel: "Compléter mon véhicule",
  ctaHref: "/compte/vehicule",
};

const PUBLISH: HowItWorksProfile = {
  heading: "Publier ses trajets",
  intro:
    "Une fois ces étapes complétées, le conducteur peut publier un trajet déjà prévu et indiquer ses places disponibles.",
  imageSrc: "/brand/axio-conducteur-voiture.png",
  imageAlt: "Publication d'un trajet Livre-moi.ca",
  imageFit: "cover",
  items: [
    "Publier un trajet déjà prévu",
    "Indiquer places, bagages et préférences",
    "Recevoir des demandes de passagers",
  ],
  ctaLabel: "Proposer un trajet",
  ctaHref: "/trajets/nouveau",
};

export function CarpoolKycSection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Avant de proposer un trajet, chaque conducteur doit être vérifié"
          subtitle="Le processus de vérification permet de mieux connaître les personnes qui proposent des places. Vérification d'identité, validation du profil, informations du véhicule et avis après le trajet restent distincts — Pour une décision plus éclairée, sans prétendre éliminer tous les risques."
          subtitleClassName="mx-auto max-w-[45rem]"
        />

        <AnimatedTabs
          tabs={[
            {
              title: "Profil",
              value: "profile",
              content: <HowItWorksProfilePanel {...PROFILE} />,
            },
            {
              title: "Identité",
              value: "identity",
              content: <HowItWorksProfilePanel {...IDENTITY} />,
            },
            {
              title: "Véhicule",
              value: "vehicle",
              content: <HowItWorksProfilePanel {...VEHICLE} />,
            },
            {
              title: "Trajets",
              value: "publish",
              content: <HowItWorksProfilePanel {...PUBLISH} />,
            },
          ]}
          containerClassName="mx-auto grid w-full max-w-4xl grid-cols-2 justify-center gap-1.5 overflow-visible rounded-lg bg-[#F6F6F6] p-1.5 dark:bg-neutral-900 lg:grid-cols-4"
          tabClassName="w-full rounded-md px-3 py-2.5 text-center text-sm font-medium sm:text-[15px]"
          activeTabClassName="rounded-md"
          layoutId="carpool-kyc-tab"
        />
      </div>
    </section>
  );
}
