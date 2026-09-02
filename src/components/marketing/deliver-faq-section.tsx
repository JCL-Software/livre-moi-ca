"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/marketing/section-header";

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
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-space text-base font-bold text-slate-950 dark:text-white md:text-lg">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          className="inline-flex shrink-0 text-orange-500"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DeliverFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <SectionHeader badge="FAQ" title="Avant de publier votre trajet." />
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <FaqItem
            key={item.question}
            {...item}
            open={openIndex === index}
            onToggle={() => setOpenIndex((c) => (c === index ? null : index))}
          />
        ))}
      </div>
    </section>
  );
}
