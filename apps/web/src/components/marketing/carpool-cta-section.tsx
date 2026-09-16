"use client";

import Link from "next/link";
import { Car } from "lucide-react";
import { motion } from "motion/react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { Search } from "@/components/animate-ui/icons/search";
import {
  staticIcon,
  useCardIconActive,
  type AppIcon,
} from "@/components/marketing/card-icon-interaction";

const CARDS: {
  title: string;
  text: string;
  href: string;
  cta: string;
  icon: AppIcon;
  primary: boolean;
}[] = [
  {
    title: "Je cherche une place",
    text: "Parcourez les trajets disponibles entre les villes du Québec et de l’Ontario.",
    href: "/recherche?type=PASSENGER",
    cta: "Trouver un covoiturage",
    icon: Search,
    primary: true,
  },
  {
    title: "Je propose un trajet",
    text: "Publiez un déplacement que vous aviez déjà prévu et indiquez vos places disponibles.",
    href: "/trajets/nouveau",
    cta: "Proposer un trajet",
    icon: staticIcon(Car),
    primary: false,
  },
];

function CtaCard({
  title,
  text,
  href,
  cta,
  icon: Icon,
  primary,
  index,
}: {
  title: string;
  text: string;
  href: string;
  cta: string;
  icon: AppIcon;
  primary: boolean;
  index: number;
}) {
  const { active, cardProps } = useCardIconActive();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 * (index + 1) }}
      {...cardProps}
      className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
        <Icon
          className="h-5 w-5"
          size={20}
          animate={active}
          animation={primary ? "find" : undefined}
        />
      </span>
      <h3 className="mt-3 text-[15px] font-semibold text-white">{title}</h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-5 text-white/70">{text}</p>
      <Link
        href={href}
        className={
          primary
            ? "mt-6 inline-flex items-center gap-2 self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
            : "mt-6 inline-flex items-center gap-2 self-start rounded-lg border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        }
      >
        {cta}
        <ArrowRight size={16} className="h-4 w-4" animate={active} />
      </Link>
    </motion.div>
  );
}

export function CarpoolCtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="uber-section-title uber-section-title-inverse text-center"
        >
          Trouvez votre place ou partagez votre trajet
        </motion.h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CARDS.map((card, index) => (
            <CtaCard key={card.title} {...card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
