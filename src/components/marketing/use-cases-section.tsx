"use client";

import { ArrowRight, Building2, Mail, ShoppingBag, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeader } from "@/components/marketing/section-header";
import { cn } from "@/lib/utils";

const LINE_COLORS = ["#1e3a5f", "#f97316", "#1a4a7a", "#cbd5e1", "#ea580c"];

function RoutePreview() {
  return (
    <div className="flex h-28 items-center overflow-hidden rounded-xl bg-slate-50 px-3 dark:bg-slate-800/70">
      <svg viewBox="0 0 320 80" className="h-full w-full" aria-hidden="true">
        <path
          d="M28 54 C 90 14, 140 70, 198 30 S 268 18, 292 42"
          fill="none"
          stroke="#1e3a5f"
          strokeWidth="2"
          strokeDasharray="5 7"
          opacity="0.35"
        />
        <circle cx="28" cy="54" r="7" fill="#f97316" />
        <circle cx="292" cy="42" r="7" fill="#1e3a5f" />
      </svg>
    </div>
  );
}

const USE_CASES = [
  {
    icon: ShoppingBag,
    title: "Marketplace et achats entre particuliers",
    description:
      "Faites transporter un achat trouvé dans une autre ville par quelqu'un qui emprunte déjà cette route.",
    header: <RoutePreview />,
    className: "md:col-span-2",
  },
  {
    icon: Wrench,
    title: "Pièces et objets urgents",
    description: "Faites parvenir rapidement une pièce, un outil ou du matériel dont vous avez besoin.",
    className: "md:col-span-1",
  },
  {
    icon: Mail,
    title: "Documents et objets importants",
    description:
      "Clés, dossiers, appareils électroniques ou objets oubliés : organisez leur transport simplement.",
    className: "md:col-span-1",
  },
  {
    icon: Building2,
    title: "Petites entreprises",
    description:
      "Livrez vos produits ou votre matériel à vos clients sans devoir gérer votre propre flotte.",
    className: "md:col-span-2",
  },
];

function HoverBentoItem({
  index,
  hoveredIndex,
  onEnter,
  onLeave,
  className,
  children,
}: {
  index: number;
  hoveredIndex: number | null;
  onEnter: () => void;
  onLeave: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative h-full", className)} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <AnimatePresence>
        {hoveredIndex === index ? (
          <motion.span
            layoutId="use-cases-hover"
            className="absolute -inset-1 block rounded-3xl bg-orange-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.18, delay: 0.12 } }}
          />
        ) : null}
      </AnimatePresence>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function UseCasesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-y border-slate-200 bg-[#fdfaf5] py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <BackgroundLines
        className="pointer-events-none absolute inset-0 h-full min-h-full w-full bg-transparent md:h-full"
        svgOptions={{ duration: 16 }}
        colors={LINE_COLORS}
      >
        <div className="absolute inset-0 bg-[#fdfaf5]/88 dark:bg-slate-950/88" />
      </BackgroundLines>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Cas d'usage"
          title="Des situations bien réelles"
          subtitle="Que ce soit pour un achat entre particuliers, une pièce urgente ou une livraison professionnelle, Livre-moi.ca vous aide à faire circuler ce qui compte."
        />

        <BentoGrid className="max-w-6xl md:auto-rows-[17.5rem] md:grid-cols-3">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <HoverBentoItem
                key={useCase.title}
                index={index}
                hoveredIndex={hoveredIndex}
                onEnter={() => setHoveredIndex(index)}
                onLeave={() => setHoveredIndex(null)}
                className={useCase.className}
              >
                <Link href="/recherche?type=PARCEL" className="block h-full">
                <BentoGridItem
                  className="h-full"
                  header={useCase.header}
                  icon={
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy dark:bg-orange-500/10 dark:text-orange-300">
                      <Icon className="h-5 w-5 transition duration-200 group-hover/bento:-translate-y-0.5" />
                    </span>
                  }
                  title={useCase.title}
                  description={
                    <>
                      <span>{useCase.description}</span>
                      <span className="mt-3 flex items-center gap-1 text-sm font-bold text-orange-600 opacity-0 transition duration-200 group-hover/bento:translate-x-0.5 group-hover/bento:opacity-100 dark:text-orange-400">
                        Publier un colis
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </>
                  }
                />
                </Link>
              </HoverBentoItem>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
