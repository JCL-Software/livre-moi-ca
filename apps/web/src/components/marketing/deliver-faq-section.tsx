"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Dois-je faire un détour pour livrer un colis ?",
    answer:
      "Non. Vous choisissez uniquement les colis qui correspondent à votre trajet habituel, sans sortir de votre itinéraire.",
  },
  {
    question: "Qui fixe le prix ?",
    answer:
      "Le conducteur et l'expéditeur conviennent librement d'une participation aux frais de déplacement, bien plus économique qu'un transporteur traditionnel.",
  },
  {
    question: "Suis-je obligé d'accepter un colis ?",
    answer:
      "Non. Vous êtes libre d'accepter ou de refuser chaque demande selon le format, l'horaire et le point de rencontre.",
  },
  {
    question: "Puis-je publier plusieurs trajets ?",
    answer:
      "Oui. Publiez autant de déplacements que vous le souhaitez entre les villes de la région ou vers Montréal et Gatineau.",
  },
  {
    question: "Quels objets sont interdits ?",
    answer:
      "Armes, alcool non conforme à la réglementation, drogues, matières dangereuses, argent comptant et tout objet illégal.",
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

export function DeliverFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div className="md:sticky md:top-28">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Avant de publier votre trajet.
            </p>
          </div>

          <div>
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
        </div>
      </div>
    </section>
  );
}
