"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "Comment se passe le point de rencontre pour récupérer le colis ?",
    answer:
      "L'expéditeur et le conducteur choisissent ensemble un endroit public, accessible et pratique. Il peut s'agir d'un stationnement, d'une station-service, d'un commerce ou d'un autre lieu sécuritaire.",
  },
  {
    question: "Comment choisir le bon format de colis ?",
    answer:
      "Choisissez le format selon l'espace réellement occupé par votre colis. En cas de doute, sélectionnez le format supérieur et ajoutez les dimensions ou une photo dans votre demande.",
  },
  {
    question: "Puis-je envoyer un colis sans accompagner le trajet ?",
    answer:
      "Oui. Le colis peut voyager avec un conducteur qui effectue déjà le trajet, sans que vous soyez présent dans le véhicule.",
  },
  {
    question: "Comment la livraison est-elle confirmée ?",
    answer:
      "Le destinataire remet un code de confirmation au conducteur lors de la réception. Cette étape permet de confirmer que le colis est arrivé à destination.",
  },
  {
    question: "Que puis-je faire livrer ?",
    answer:
      "Vous pouvez envoyer des documents, des vêtements, des achats Marketplace, des pièces, des outils et plusieurs objets du quotidien. Le colis doit être légal, sécuritaire, correctement emballé et compatible avec l'espace disponible.",
  },
  {
    question: "Quels articles sont interdits ?",
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

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div className="md:sticky md:top-28">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
              Questions fréquentes
            </h2>
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
