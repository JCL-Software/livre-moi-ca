"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question:
      "Comment se passe la traversée du Parc de La Vérendrye avec les zones hors réseau ?",
    answer:
      "Les détails du trajet et les arrêts (ex. halte du Domaine ou Grand-Remous) sont convenus avant le départ. Une fois engagé sur la route, le plan est clair pour tout le monde même sans couverture cellulaire.",
  },
  {
    question: "Combien de bagages puis-je apporter ?",
    answer:
      "Chaque annonce de conducteur précise le gabarit de bagage autorisé (petit sac à dos, valise cabine ou grand sac). Si vous avez des équipements encombrants (sac de hockey, équipement de ski), vérifiez avec le conducteur avant de réserver.",
  },
  {
    question: "Que se passe-t-il si un passager ou un conducteur est en retard ?",
    answer:
      "Une tolérance de 10 à 15 minutes est appliquée. Grâce à notre messagerie, vous pouvez facilement prévenir l'autre partie. En cas d'absence injustifiée (no-show), notre politique d'annulation protège le conducteur.",
  },
  {
    question: "Puis-je voyager avec mon animal de compagnie ?",
    answer:
      "Les conducteurs indiquent directement sur leur profil s'ils acceptent les animaux (généralement en cage de transport ou attachés). Filtrez simplement vos recherches selon ce critère.",
  },
  {
    question: "Est-ce légal au Québec de faire payer pour un covoiturage ?",
    answer:
      "Oui, tout à fait. La loi québécoise autorise le partage des frais de déplacement (essence, entretien, péages). Le covoiturage n'est pas un service de taxi commercial, mais une contribution aux coûts réels du trajet.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-neutral-800 dark:text-neutral-100 md:text-lg">
          {question}
        </span>
        <span className="relative mt-0.5 h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400">
          <IconPlus
            className={cn(
              "absolute inset-0 h-5 w-5 transition duration-200",
              open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
            )}
          />
          <IconMinus
            className={cn(
              "absolute inset-0 h-5 w-5 transition duration-200",
              open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0",
            )}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CarpoolFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <div className="order-2 md:order-1">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>

          <div className="order-1 md:sticky md:top-28 md:order-2 md:text-right">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Tout ce qu&apos;il faut savoir avant de covoiturer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
