"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const FAQ_ITEMS = [
  {
    question: "Comment se passe le point de rencontre pour récupérer le colis?",
    answer:
      "L'expéditeur et le conducteur choisissent ensemble un endroit public, accessible et pratique. Il peut s'agir d'un stationnement, d'une station-service, d'un commerce ou d'un autre lieu sécuritaire.",
  },
  {
    question: "Comment choisir le bon format de colis?",
    answer:
      "Choisissez le format selon l'espace réellement occupé par votre colis. En cas de doute, sélectionnez le format supérieur et ajoutez les dimensions ou une photo dans votre demande.",
  },
  {
    question: "Puis-je envoyer un colis sans accompagner le trajet?",
    answer:
      "Oui. Le colis peut voyager avec un conducteur qui effectue déjà le trajet, sans que vous soyez présent dans le véhicule.",
  },
  {
    question: "Comment la livraison est-elle confirmée?",
    answer:
      "Le destinataire remet un code de confirmation au conducteur lors de la réception. Cette étape permet de confirmer que le colis est arrivé à destination.",
  },
  {
    question: "Que puis-je faire livrer?",
    answer:
      "Vous pouvez envoyer des documents, des vêtements, des achats Marketplace, des pièces, des outils et plusieurs objets du quotidien. Le colis doit être légal, sécuritaire, correctement emballé et compatible avec l'espace disponible.",
  },
  {
    question: "Quels articles sont interdits?",
    answer:
      "Les matières dangereuses, les armes, les produits illégaux, les articles mal emballés et les denrées périssables qui ne peuvent pas être transportées de façon sécuritaire ne sont pas acceptés.",
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
