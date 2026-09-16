"use client";

import { Car, Luggage, Share2 } from "lucide-react";
import { Clock3 } from "@/components/animate-ui/icons/clock-3";
import { MessageCircle } from "@/components/animate-ui/icons/message-circle";
import { Star } from "@/components/animate-ui/icons/star";
import { UserRound } from "@/components/animate-ui/icons/user-round";
import { Users } from "@/components/animate-ui/icons/users";
import { CigaretteOffIcon } from "@/components/ui/cigarette-off";
import PawPrintIcon from "@/components/ui/paw-print-icon";
import { useState } from "react";
import {
  staticIcon,
  type AppIcon,
} from "@/components/marketing/card-icon-interaction";
import { SectionHeader } from "@/components/marketing/section-header";
import { cn } from "@/lib/utils";

const ITEMS: {
  title: string;
  description: string;
  icon: AppIcon;
  className?: string;
}[] = [
  {
    title: "Toutes les informations avant de réserver",
    description:
      "Consultez le profil du conducteur, le véhicule, les avis et les conditions du trajet au même endroit.",
    icon: UserRound,
    className: "sm:col-span-2",
  },
  {
    title: "Avis de la communauté",
    description: "Retours d'autres passagers et conducteurs après les trajets.",
    icon: Star,
  },
  {
    title: "Véhicule",
    description: "Modèle et informations utiles pour reconnaître le conducteur.",
    icon: staticIcon(Car),
  },
  {
    title: "Places disponibles",
    description: "Nombre de sièges encore libres sur le trajet.",
    icon: Users,
  },
  {
    title: "Espace bagages",
    description: "Ce qui peut entrer dans le coffre, sans ambiguïté.",
    icon: staticIcon(Luggage),
  },
  {
    title: "Animaux acceptés",
    description: "Préférence indiquée clairement sur l'annonce.",
    icon: PawPrintIcon,
  },
  {
    title: "Non-fumeur",
    description: "Ambiance et règles du véhicule visibles avant réservation.",
    icon: CigaretteOffIcon,
  },
  {
    title: "Ambiance souhaitée",
    description: "Discussion, calme ou musique.",
    icon: MessageCircle,
  },
  {
    title: "Partage de trajet sécurisé",
    description:
      "Partager votre trajet en direct avec un proche ou un ami — Celui-ci voit votre position en temps réel, le trajet prévu, l’heure d’arrivée estimée et tous les détails pertinents sur le chauffeur.",
    icon: staticIcon(Share2),
    className: "sm:col-span-2",
  },
  {
    title: "Heure de départ",
    description: "Horaire clair pour organiser votre journée.",
    icon: Clock3,
  },
];

export function CarpoolBookingInfoSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-muted relative overflow-hidden py-16 md:py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <SectionHeader
          title="Toutes les informations importantes, au même endroit"
          subtitle="Ce que vous voyez avant de réserver — Pour choisir un trajet qui vous convient vraiment."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ title, description, icon: Icon, className }, index) => {
            const active = hoveredIndex === index;
            return (
              <div
                key={title}
                className={cn("h-full", className)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="feature-card h-full rounded-xl border border-neutral-200 bg-white p-5 shadow-sm before:hidden dark:border-white/10 dark:bg-neutral-950">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-900 dark:text-white">
                    <Icon className="h-4 w-4" size={16} animate={active} />
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-black dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
