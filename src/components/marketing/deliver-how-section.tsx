"use client";

import { Camera, MapPin, Package, Route } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";
import { StepsGrid } from "@/components/marketing/steps-grid";

const STEPS = [
  {
    step: 1,
    icon: Route,
    title: "Publiez votre trajet",
    text: "Indiquez le départ, la destination, la date et l'espace disponible dans votre véhicule.",
  },
  {
    step: 2,
    icon: Package,
    title: "Recevez des demandes",
    text: "Les expéditeurs de la région vous contactent directement pour des envois compatibles avec votre itinéraire.",
  },
  {
    step: 3,
    icon: MapPin,
    title: "Choisissez le colis",
    text: "Vous n'acceptez que les demandes qui vous conviennent — format, horaire et point de rencontre.",
  },
  {
    step: 4,
    icon: Camera,
    title: "Livrez et encaissez",
    text: "Remettez le colis au destinataire, validez avec le code OTP et recevez votre paiement.",
  },
];

export function DeliverHowSection() {
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
