"use client";

import { Car, Fuel } from "lucide-react";
import { LeafIcon } from "@/components/ui/leaf";
import {
  staticIcon,
  useCardIconActive,
  type AppIcon,
} from "@/components/marketing/card-icon-interaction";
import { SectionHeader } from "@/components/marketing/section-header";

const POINTS: {
  icon: AppIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: staticIcon(Fuel),
    title: "Partager les frais d’essence",
    text: "Répartissez le coût d’un déplacement déjà prévu entre plusieurs personnes.",
  },
  {
    icon: staticIcon(Car),
    title: "Utiliser un trajet déjà prévu",
    text: "Pas de détour inventé : vous occupez des places libres sur une route existante.",
  },
  {
    icon: LeafIcon,
    title: "Moins de véhicules seuls",
    text: "Chaque place occupée contribue à réduire le nombre de voitures qui circulent à une seule personne.",
  },
];

function ShareCard({
  icon: Icon,
  title,
  text,
}: {
  icon: AppIcon;
  title: string;
  text: string;
}) {
  const { active, cardProps } = useCardIconActive();

  return (
    <div
      {...cardProps}
      className="feature-card rounded-xl border border-neutral-200 bg-white p-6 shadow-sm before:hidden dark:border-white/10 dark:bg-neutral-950"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-900 dark:text-white">
        <Icon className="h-5 w-5" size={20} animate={active} />
      </span>
      <h3 className="mt-3 text-[15px] font-semibold leading-snug text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-5 text-neutral-600 dark:text-neutral-400">
        {text}
      </p>
    </div>
  );
}

export function CarpoolShareSection() {
  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Un trajet partagé, moins de frais pour chacun"
          subtitle="Une façon simple de réduire le coût de son trajet tout en occupant les places libres."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {POINTS.map((point) => (
            <ShareCard key={point.title} {...point} />
          ))}
        </div>
      </div>
    </section>
  );
}
