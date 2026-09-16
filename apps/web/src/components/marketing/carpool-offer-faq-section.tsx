"use client";

import { UberFaq } from "@/components/baseweb/uber-faq";

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
      "Oui. Publiez autant de déplacements que vous le souhaitez entre les villes du Québec et de l’Ontario.",
  },
  {
    question: "Comment sont gérés les bagages ?",
    answer:
      "Vous indiquez votre politique de bagages lors de la publication. Les passagers savent à l'avance ce qu'ils peuvent apporter.",
  },
];

export function CarpoolOfferFaqSection() {
  return (
    <UberFaq
      title="Questions fréquentes"
      subtitle="Avant de proposer vos places."
      items={FAQ_ITEMS}
    />
  );
}
