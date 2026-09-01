"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const FAQ_ITEMS = [
  {
    question: "Comment se passe le point de rencontre pour récupérer le colis ?",
    answer:
      "Les utilisateurs s'entendent via la messagerie sur un point de repère simple et accessible sur le trajet du conducteur (par exemple : le stationnement d'un Tim Hortons, d'un Petro-Canada ou une sortie familière le long de la 117).",
  },
  {
    question: "Comment est fixé le prix de la livraison ?",
    answer:
      "Le prix est calculé en fonction de la distance parcourue et de la taille du colis. Il s'agit d'une participation aux frais de déplacement, bien plus économique qu'une livraison express traditionnelle.",
  },
  {
    question: "Que faire si le destinataire n'est pas présent à l'arrivée ?",
    answer:
      "L'expéditeur et le destinataire s'engagent à respecter l'horaire convenu avec le conducteur. En cas d'imprévu, le conducteur peut convenir d'un lieu de dépôt sécurisé ou retourner l'objet selon les consignes convenues avec l'expéditeur via l'application.",
  },
  {
    question: "Puis-je combiner covoiturage de passagers et transport de colis ?",
    answer:
      "Absolument ! En tant que conducteur, vous pouvez accepter un passager sur un siège et un colis dans votre coffre pour maximiser la rentabilité de votre trajet vers Montréal ou entre les villes de la région.",
  },
  {
    question: "Quels types d'objets sont interdits ?",
    answer:
      "Tout produit illégal, alcool/cannabis non scellé selon les lois en vigueur, matières inflammables, armes, animaux vivants et objets d'une valeur marchande excessive sans accord préalable.",
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
        <AnimateIcon animateOnHover={false}>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex shrink-0 text-orange-500"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </AnimateIcon>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
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

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="FAQ"
        title="Questions fréquentes sur la livraison de colis"
      />

      <div className="space-y-3">
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
    </section>
  );
}
