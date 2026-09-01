"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

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

export function CarpoolFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="FAQ"
        title="Questions fréquentes sur le covoiturage"
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
