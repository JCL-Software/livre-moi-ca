"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type FaqGroup = {
  title: string;
  items: { question: string; answer: string }[];
};

const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Sécurité et confiance",
    items: [
      {
        question: "Comment les conducteurs sont-ils vérifiés ?",
        answer:
          "Avant de proposer des places, chaque conducteur doit compléter les étapes requises : création du profil, confirmation d’identité et informations du véhicule. Cela ne supprime pas tous les risques, mais fournit des informations vérifiées pour mieux choisir.",
      },
      {
        question: "Quelles informations puis-je consulter avant de réserver ?",
        answer:
          "Photo, avis, véhicule, nombre de places, espace bagages, préférences (animaux, non-fumeur, ambiance), point de rencontre et heure de départ sont visibles sur l’annonce.",
      },
      {
        question: "Que faire si je ne me sens pas à l’aise ?",
        answer:
          "Vous pouvez annuler selon les conditions de réservation, utiliser la messagerie pour clarifier la situation, ou contacter le support. Ne montez jamais dans un véhicule si vous ne vous sentez pas en sécurité.",
      },
      {
        question: "Comment fonctionne la messagerie ?",
        answer:
          "Les échanges liés au trajet restent dans l’application. Cela garde un historique clair et évite de partager des coordonnées personnelles trop tôt.",
      },
    ],
  },
  {
    title: "Réservation",
    items: [
      {
        question: "Quand le paiement est-il effectué ?",
        answer:
          "Le paiement est géré dans l’application au moment de la réservation. Il n’y a pas d’échange d’argent comptant entre passager et conducteur.",
      },
      {
        question: "Que se passe-t-il si le conducteur annule ?",
        answer:
          "Vous êtes informé dans l’application. Selon le cas, la réservation peut être remboursée ou vous pouvez chercher un autre trajet disponible.",
      },
      {
        question: "Puis-je modifier ou annuler ma réservation ?",
        answer:
          "Oui, selon les délais et conditions affichés au moment de la réservation. Les modifications importantes (horaire, bagages) se font idéalement via la messagerie avant le départ.",
      },
    ],
  },
  {
    title: "Organisation du trajet",
    items: [
      {
        question: "Où se trouve le point de rencontre ?",
        answer:
          "Il est convenu et affiché dans la réservation — Souvent un lieu public pratique (stationnement, commerce, sortie d’autoroute). Confirmez-le avant le départ.",
      },
      {
        question: "Combien de bagages puis-je apporter ?",
        answer:
          "Chaque annonce précise l’espace disponible. Si vous avez un équipement encombrant, vérifiez avec le conducteur avant de réserver.",
      },
      {
        question: "Puis-je voyager avec un animal ?",
        answer:
          "Uniquement si le conducteur l’indique sur son annonce. Respectez les conditions précisées (cage, laisse, etc.).",
      },
      {
        question: "Que se passe-t-il dans les zones sans réseau ?",
        answer:
          "Les détails du trajet, les arrêts et le point de rencontre sont confirmés avant le départ. Une fois en route, le plan reste clair même sans couverture cellulaire.",
      },
    ],
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
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div className="md:sticky md:top-28">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl lg:text-5xl">
              Questions fréquentes
            </h2>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400">
              Sécurité, réservation et organisation du trajet
            </p>
          </div>

          <div className="space-y-10">
            {FAQ_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  {group.title}
                </h3>
                {group.items.map((item) => {
                  const key = `${group.title}-${item.question}`;
                  return (
                    <FaqItem
                      key={key}
                      question={item.question}
                      answer={item.answer}
                      open={openKey === key}
                      onToggle={() =>
                        setOpenKey((current) => (current === key ? null : key))
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
