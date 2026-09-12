"use client";

import { ClipboardCheck } from "@/components/animate-ui/icons/clipboard-check";
import { Lock } from "@/components/animate-ui/icons/lock";
import { UserRound } from "@/components/animate-ui/icons/user-round";
import { UserCheckIcon } from "@/components/ui/user-check";
import { IdCardIcon } from "@/components/ui/id-card";
import {
  useCardIconActive,
  type AppIcon,
} from "@/components/marketing/card-icon-interaction";
import { SectionHeader } from "@/components/marketing/section-header";

const CARDS: {
  title: string;
  description: string;
  icon: AppIcon;
}[] = [
  {
    title: "Identité vérifiée",
    description:
      "Le conducteur confirme son identité à l'aide du processus de vérification intégré.",
    icon: IdCardIcon,
  },
  {
    title: "Profil transparent",
    description:
      "Consultez les informations importantes avant de réserver : photo, avis, véhicule, préférences et trajets proposés.",
    icon: UserRound,
  },
  {
    title: "Réservation sécurisée",
    description:
      "Les détails de la réservation et le paiement sont gérés dans l'application, sans échange d'argent comptant.",
    icon: Lock,
  },
  {
    title: "Confirmation du trajet",
    description:
      "Tout est regroupé dans l’application : réservation, messages et historique du trajet.",
    icon: ClipboardCheck,
  },
];

function SafetyCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: AppIcon;
}) {
  const { active, cardProps } = useCardIconActive();

  return (
    <article
      {...cardProps}
      className="feature-card flex flex-col rounded-lg border border-neutral-200 bg-card p-6 shadow-sm before:hidden dark:border-white/10 dark:bg-card"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
          <Icon className="h-5 w-5" size={20} animate={active} />
        </span>
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </article>
  );
}

export function CarpoolSafetySection() {
  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Voyagez plus sereinement grâce à des informations claires"
          subtitle="La confiance commence avant le départ. Chaque conducteur qui propose un trajet doit compléter les étapes de vérification requises avant de pouvoir accueillir des passagers. Des informations claires pour choisir en toute confiance."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <SafetyCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
