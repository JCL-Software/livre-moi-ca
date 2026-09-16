"use client";

import { UberFaq } from "@/components/baseweb/uber-faq";

type FaqGroup = {
  title: string;
  items: { question: string; answer: string }[];
};

const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Organisation du transport",
    items: [
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
    ],
  },
  {
    title: "Livraison",
    items: [
      {
        question: "Comment la livraison est-elle confirmée ?",
        answer:
          "Le destinataire remet un code de confirmation au conducteur lors de la réception. Cette étape permet de confirmer que le colis est arrivé à destination.",
      },
    ],
  },
  {
    title: "Types de colis",
    items: [
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
    ],
  },
];

export function FaqSection() {
  return (
    <UberFaq
      title="Questions fréquentes"
      subtitle="Organisation, livraison et types de colis"
      groups={FAQ_GROUPS}
    />
  );
}
