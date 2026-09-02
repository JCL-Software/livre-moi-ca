"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeader } from "@/components/marketing/section-header";

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

export function CarpoolOfferFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <SectionHeader badge="FAQ" title="Avant de proposer vos places." />
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
