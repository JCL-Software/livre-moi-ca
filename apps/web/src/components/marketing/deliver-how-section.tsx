"use client";

import { Package } from "lucide-react";
import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { Route } from "@/components/animate-ui/icons/route";
import CameraIcon from "@/components/ui/camera-icon";
import { SectionHeader } from "@/components/marketing/section-header";
import { StepsGrid } from "@/components/marketing/steps-grid";
import { withoutHoverProp } from "@/components/marketing/without-hover-prop";

const PackageIcon = withoutHoverProp(Package);

const STEPS = [
  {
    step: 1,
    icon: Route,
    title: "Publiez votre trajet",
    text: "Indiquez le départ, la destination, la date et l'espace disponible dans votre véhicule.",
  },
  {
    step: 2,
    icon: PackageIcon,
    title: "Proposez un tarif",
    text: "Les annonces de colis sont publiques. Proposez un tarif sur celles qui correspondent à votre trajet.",
  },
  {
    step: 3,
    icon: MapPin,
    title: "L’expéditeur vous choisit",
    text: "Vous n’êtes retenu que si votre offre convient — format, horaire et point de rencontre.",
  },
  {
    step: 4,
    icon: CameraIcon,
    title: "Confirmez la remise",
    text: "Remettez le colis et validez avec le code. Le versement se fait en ligne.",
  },
];

export function DeliverHowSection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Comment ça marche"
          title="En quatre étapes simples."
        />
        <StepsGrid steps={STEPS} />
      </div>
    </section>
  );
}
