"use client";

import { UberFaq } from "@/components/baseweb/uber-faq";

const FAQ_ITEMS = [
  {
    question: "Dois-je faire un détour pour livrer un colis ?",
    answer:
      "Non. Vous choisissez uniquement les colis qui correspondent à votre trajet habituel, sans sortir de votre itinéraire.",
  },
  {
    question: "Qui fixe le prix ?",
    answer:
      "Vous proposez un tarif sur l’annonce du colis. L’expéditeur l’accepte ou en discute. Le paiement se fait en ligne.",
  },
  {
    question: "Suis-je obligé de proposer un tarif ?",
    answer:
      "Non. Vous proposez un tarif uniquement sur les colis qui vous conviennent, selon le format, l’horaire et le point de rencontre.",
  },
  {
    question: "Puis-je publier plusieurs trajets ?",
    answer:
      "Oui. Publiez autant de déplacements que vous le souhaitez entre les villes du Québec et de l’Ontario.",
  },
  {
    question: "Quels objets sont interdits ?",
    answer:
      "Armes, alcool non conforme à la réglementation, drogues, matières dangereuses, argent comptant et tout objet illégal.",
  },
];

export function DeliverFaqSection() {
  return (
    <UberFaq
      title="Questions fréquentes"
      subtitle="Avant de publier votre trajet."
      items={FAQ_ITEMS}
    />
  );
}
