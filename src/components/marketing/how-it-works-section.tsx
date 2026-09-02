"use client";

import {
  Camera,
  HandCoins,
  MapPin,
  MessageCircle,
  Package,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { SectionHeader } from "@/components/marketing/section-header";
import { StepsGrid } from "@/components/marketing/steps-grid";

const SENDER_STEPS = [
  {
    step: 1,
    icon: Package,
    title: "Publiez votre annonce",
    text: "Indiquez la ville de départ, la destination (ex. Rouyn-Noranda ➔ Val-d'Or ou Montréal), le format du colis et vos disponibilités.",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Trouvez un conducteur de confiance",
    text: "Entrez en contact avec un habitant de la région qui fait déjà le trajet et convenez d'un point de rencontre facile d'accès.",
  },
  {
    step: 3,
    icon: Camera,
    title: "Remettez le colis avec photo",
    text: "Prenez une photo rapide de l'état du paquet au moment de la remise pour assurer une transparence totale.",
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: "Validez la livraison par code OTP",
    text: "Dès que le destinataire reçoit le colis et fournit son code secret à 6 chiffres, la livraison est confirmée et le conducteur est rémunéré.",
  },
];

const DRIVER_STEPS = [
  {
    step: 1,
    icon: Route,
    title: "Proposez votre trajet",
    text: "Publiez votre déplacement (ex. Amos ➔ Gatineau) en précisant l'espace disponible dans votre coffre ou banquette arrière.",
  },
  {
    step: 2,
    icon: MapPin,
    title: "Acceptez des demandes de colis",
    text: "Recevez des demandes d'envois compatibles avec votre itinéraire sans faire de détour inutile.",
  },
  {
    step: 3,
    icon: Truck,
    title: "Transportez et gagnez de l'argent",
    text: "Récupérez le colis, faites votre route habituelle et remettez-le au point de chute convenu.",
  },
  {
    step: 4,
    icon: HandCoins,
    title: "Rentabilisez votre essence",
    text: "Entrez le code OTP remis par le destinataire à l'arrivée pour débloquer votre paiement immédiatement.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Comment ça marche"
        title="Le cotransportage en région, comment ça marche ?"
        subtitle="Une façon simple, économique et humaine de faire voyager vos colis"
      />

      <AnimatedTabs
        tabs={[
          {
            title: "J'ai un colis à envoyer",
            value: "sender",
            content: <StepsGrid steps={SENDER_STEPS} />,
          },
          {
            title: "Je prends la route (Conducteur)",
            value: "driver",
            content: <StepsGrid steps={DRIVER_STEPS} />,
          },
        ]}
        containerClassName="mx-auto justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-900"
        tabClassName="px-5 py-2.5 text-sm font-bold sm:text-base"
        layoutId="how-it-works-colis-tab"
      />
    </section>
  );
}
