"use client";

import { MessageSquare } from "@/components/animate-ui/icons/message-square";
import { CreditCardIcon } from "@/components/ui/credit-card";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import {
  useCardIconActive,
  type AppIcon,
} from "@/components/marketing/card-icon-interaction";

const ITEMS: {
  icon: AppIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: ShieldCheckIcon,
    title: "Conducteurs vérifiés",
    text: "Identité confirmée avant d’accueillir des passagers.",
  },
  {
    icon: CreditCardIcon,
    title: "Tarif clair, sans argent comptant",
    text: "Le paiement se fait en ligne. Les montants restent visibles avant le départ.",
  },
  {
    icon: MessageSquare,
    title: "Réservation et communication centralisées",
    text: "Tous les détails du trajet au même endroit.",
  },
];

function TrustStripCard({
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
      className="feature-card flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm before:hidden dark:border-white/10 dark:bg-neutral-950"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-900 dark:text-white">
        <Icon className="h-4 w-4" size={16} animate={active} aria-hidden />
      </span>
      <div>
        <p className="text-sm font-semibold text-black dark:text-white">
          {title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {text}
        </p>
      </div>
    </div>
  );
}

export function CarpoolTrustStrip() {
  return (
    <section className="section-plain border-b border-neutral-200/80 py-8 dark:border-white/10 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <TrustStripCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
