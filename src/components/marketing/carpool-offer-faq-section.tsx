"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Dois-je modifier mon itinéraire pour prendre des passagers ?",
    answer:
      "Non. Vous proposez uniquement les places libres sur le trajet que vous aviez déjà prévu, avec les arrêts qui vous conviennent.",
  },
  {
    question: "Qui fixe le prix par siège ?",
    answer:
      "Vous définissez librement la participation aux frais d'essence. Les passagers voient le prix avant de réserver.",
  },
  {
    question: "Suis-je obligé d'accepter un passager ?",
    answer:
      "Non. Vous validez chaque demande de réservation et pouvez refuser si le profil ou l'horaire ne vous convient pas.",
  },
  {
    question: "Puis-je proposer plusieurs trajets ?",
    answer:
      "Oui. Publiez autant de déplacements que vous le souhaitez entre les villes de la région ou vers Montréal et Gatineau.",
  },
  {
    question: "Comment sont gérés les bagages ?",
    answer:
      "Vous indiquez votre politique de bagages lors de la publication. Les passagers savent à l'avance ce qu'ils peuvent apporter.",
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

export function CarpoolOfferFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-muted py-16 md:py-20">
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
              Avant de proposer vos places.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
