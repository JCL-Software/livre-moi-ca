"use client";

import { UberFaq } from "@/components/baseweb/uber-faq";

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
      {
        question: "Puis-je partager mon trajet avec un proche ?",
        answer:
          "Oui. Avec « Partager mon trajet », vous envoyez un lien sécurisé à un contact. Celui-ci voit votre position en temps réel, le trajet prévu, le conducteur ou le véhicule si pertinent, et l’heure d’arrivée estimée. Le partage s’arrête automatiquement à la fin du trajet, ou manuellement.",
      },
    ],
  },
  {
    title: "Réservation",
    items: [
      {
        question: "Quand le paiement est-il effectué ?",
        answer:
          "Le paiement se fait en ligne via l’application. Vous voyez le tarif avant de réserver, sans argent comptant.",
      },
      {
        question: "Que se passe-t-il si le conducteur annule ?",
        answer:
          "Vous êtes informé dans l’application. Vous pouvez alors chercher un autre trajet disponible.",
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

export function CarpoolFaqSection() {
  return (
    <UberFaq
      title="Questions fréquentes"
      subtitle="Sécurité, réservation et organisation du trajet"
      groups={FAQ_GROUPS}
    />
  );
}
