"use client";

import {
  CalendarCheck,
  Car,
  CreditCard,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { SectionHeader } from "@/components/marketing/section-header";
import { StepsGrid } from "@/components/marketing/steps-grid";

const PASSENGER_STEPS = [
  {
    step: 1,
    icon: Search,
    title: "Trouvez votre trajet",
    text: "Indiquez votre ville de départ et votre destination (ex. Rouyn-Noranda ➔ Montréal, Val-d'Or ➔ Amos) et choisissez la date qui vous convient.",
  },
  {
    step: 2,
    icon: CalendarCheck,
    title: "Réservez en ligne",
    text: "Consultez le profil du conducteur, le nombre de places restantes, la politique de bagages et réservez votre siège en toute sécurité.",
  },
  {
    step: 3,
    icon: MapPin,
    title: "Rejoignez le point de rendez-vous",
    text: "Retrouvez le conducteur au lieu convenu (Tim Hortons, dépanneur, sortie d'autoroute) et installez-vous confortablement.",
  },
  {
    step: 4,
    icon: Users,
    title: "Voyagez en toute tranquillité",
    text: "Profitez du trajet, partagez une bonne discussion (ou du silence si vous préférez !) et confirmez l'arrivée pour finaliser le voyage.",
  },
];

const DRIVER_STEPS = [
  {
    step: 1,
    icon: Car,
    title: "Publiez votre itinéraire",
    text: "Renseignez votre point de départ, vos arrêts possibles sur la 117, votre heure de départ et le prix par siège.",
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
    text: "Accueillez vos passagers, faites vos pauses habituelles (ex. Le Domaine, Grand-Remous) et partagez la route.",
  },
  {
    step: 4,
    icon: CreditCard,
    title: "Encaissez automatiquement vos gains",
    text: "Votre participation aux frais d'essence est virée directement sur votre compte une fois le voyage terminé.",
  },
];

export function CarpoolHowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Comment ça marche"
        title="Comment voyager avec Livre-moi.ca ?"
        subtitle="En quelques clics, trouvez votre place ou complétez votre véhicule."
      />

      <AnimatedTabs
        tabs={[
          {
            title: "Je cherche une place (Passager)",
            value: "passenger",
            content: <StepsGrid steps={PASSENGER_STEPS} />,
          },
          {
            title: "Je prends le volant (Conducteur)",
            value: "driver",
            content: <StepsGrid steps={DRIVER_STEPS} />,
          },
        ]}
        containerClassName="mx-auto justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-900/80"
        tabClassName="px-5 py-2.5 text-sm font-bold sm:text-base"
        activeTabClassName="bg-orange-500 shadow-lg shadow-orange-500/25"
      />
    </section>
  );
}
