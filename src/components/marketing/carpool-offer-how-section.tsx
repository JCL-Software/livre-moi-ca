"use client";

import { Car, CreditCard, MapPin, Users } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";
import { StepsGrid } from "@/components/marketing/steps-grid";

const STEPS = [
  {
    step: 1,
    icon: Car,
    title: "Publiez votre itinéraire",
    text: "Renseignez votre point de départ, vos arrêts possibles, votre heure de départ et le prix par siège.",
  },
  {
    step: 2,
    icon: Users,
    title: "Validez les demandes",
    text: "Recevez les réservations de passagers avec des profils vérifiés et des avis de la communauté.",
  },
  {
    step: 3,
    icon: MapPin,
    title: "Roulez en bonne compagnie",
    text: "Accueillez vos passagers, faites vos pauses habituelles et partagez la route.",
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Encaissez automatiquement",
    text: "Votre participation aux frais d'essence est virée directement sur votre compte une fois le voyage terminé.",
  },
];

export function CarpoolOfferHowSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Comment ça marche"
        title="En quatre étapes simples."
      />
      <StepsGrid steps={STEPS} />
    </section>
  );
}
