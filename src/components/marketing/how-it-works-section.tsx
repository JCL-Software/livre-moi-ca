"use client";

import {
  Briefcase,
  Building2,
  Camera,
  HandCoins,
  Lock,
  MapPin,
  MessageCircle,
  Package,
  Repeat,
  Route,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import {
  HowItWorksProfilePanel,
  type HowItWorksProfile,
} from "@/components/marketing/how-it-works-profile-panel";
import { SectionHeader } from "@/components/marketing/section-header";

const SENDER_TRUST = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    text: "Identité et téléphone confirmés, plus les avis de la communauté avant chaque remise.",
  },
  {
    icon: Lock,
    title: "Paiement après OTP",
    text: "Le conducteur n'est payé que lorsque le destinataire donne le code secret à 6 chiffres.",
  },
  {
    icon: Camera,
    title: "Photo à la remise",
    text: "Un constat visuel du colis est enregistré au départ pour éviter tout malentendu.",
  },
];

const DRIVER_TRUST = [
  {
    icon: ShieldCheck,
    title: "Demandes filtrées",
    text: "Vous ne voyez que les colis compatibles avec votre itinéraire, sans détour imposé.",
  },
  {
    icon: Lock,
    title: "Gains débloqués à l'arrivée",
    text: "Entrez le code OTP du destinataire : le paiement est libéré immédiatement.",
  },
  {
    icon: Camera,
    title: "Traçabilité simple",
    text: "Photo au départ et messagerie intégrée pour convenir d'un point de rencontre clair.",
  },
];

const PARTICULIER_EXPEDITEUR: HowItWorksProfile = {
  heading: "Je suis un particulier qui envoie un colis",
  intro:
    "Vous devez faire voyager un colis entre deux villes du Québec ou vers l'Ontario ? Publiez votre demande : un conducteur qui fait déjà le trajet peut la prendre. Le paiement reste bloqué jusqu'à la confirmation par code OTP.",
  imageSrc: "/brand/axio-colis.png",
  imageAlt: "Axio — Livreur Livre-moi.ca avec un colis",
  stepsTitle: "Envoyez vos colis tout simplement",
  steps: [
    {
      step: 1,
      icon: Package,
      title: "Publiez votre demande",
      text: "Indiquez le départ, la destination, le format du colis et vos disponibilités. L'annonce est gratuite.",
    },
    {
      step: 2,
      icon: MessageCircle,
      title: "Recevez des offres de conducteurs",
      text: "Des habitants de la région déjà en route vous contactent. Convenez d'un point de rencontre facile d'accès.",
    },
    {
      step: 3,
      icon: Camera,
      title: "Remettez le colis avec photo",
      text: "Une photo de l'état du paquet est prise au moment de la prise en charge.",
    },
    {
      step: 4,
      icon: ShieldCheck,
      title: "Validez par code OTP",
      text: "Le destinataire donne son code à 6 chiffres à l'arrivée. La livraison est confirmée et le conducteur est payé.",
    },
  ],
  ctaLabel: "Publier ma demande",
  ctaHref: "/recherche?type=PARCEL",
  closingTitle: "Publiez votre demande et trouvez un trajet disponible.",
  closingText:
    "Un conducteur déjà en route entre vos villes peut prendre le colis. Pas de camion dédié, pas d'attente de 3 à 5 jours.",
  trust: SENDER_TRUST,
};

const PARTICULIER_CONDUCTEUR: HowItWorksProfile = {
  heading: "Je suis un particulier qui prend la route",
  intro:
    "Vous faites déjà le trajet ? Indiquez votre itinéraire et l'espace libre dans le coffre. Des expéditeurs de la région vous proposent des colis compatibles, sans détour inutile. Vous êtes payé quand le destinataire valide le code OTP.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Axio — Conducteur Livre-moi.ca prêt à prendre la route",
  stepsTitle: "Rentabilisez vos kilomètres tout simplement",
  steps: [
    {
      step: 1,
      icon: Route,
      title: "Proposez votre trajet",
      text: "Publiez votre déplacement (départ, destination, date) et précisez l'espace disponible.",
    },
    {
      step: 2,
      icon: MapPin,
      title: "Acceptez des demandes de colis",
      text: "Recevez uniquement des envois alignés sur votre itinéraire. Vous choisissez ce que vous prenez.",
    },
    {
      step: 3,
      icon: Truck,
      title: "Transportez sur votre route habituelle",
      text: "Récupérez le colis, roulez comme prévu et remettez-le au point convenu.",
    },
    {
      step: 4,
      icon: HandCoins,
      title: "Encaissez à l'arrivée",
      text: "Entrez le code OTP du destinataire pour débloquer votre participation aux frais d'essence.",
    },
  ],
  ctaLabel: "Publier mon trajet",
  ctaHref: "/trajets/nouveau",
  closingTitle: "Publiez votre trajet et recevez des demandes de colis.",
  closingText:
    "Chaque kilomètre déjà prévu peut servir. Vous n'ajoutez pas de déplacement : vous remplissez un coffre déjà en route.",
  trust: DRIVER_TRUST,
};

const COMMERCE_EXPEDITEUR: HowItWorksProfile = {
  heading: "Je suis un commerce qui expédie en région",
  intro:
    "Boutique, atelier ou vente Marketplace : livrez un client hors de votre ville grâce à un conducteur déjà en route. Pas de flotte dédiée. Un trajet existant vers Gatineau, Montréal ou entre les villes de la région suffit.",
  imageSrc: "/brand/axio-colis.png",
  imageAlt: "Axio — Colis Livre-moi.ca pour un commerce en région",
  stepsTitle: "Servez vos clients hors région, simplement",
  steps: [
    {
      step: 1,
      icon: Building2,
      title: "Décrivez l'envoi",
      text: "Destination du client, format du colis et créneau de remise. Idéal pour une commande ponctuelle ou urgente.",
    },
    {
      step: 2,
      icon: Route,
      title: "Trouvez un conducteur déjà en route",
      text: "La plateforme rapproche votre envoi d'un trajet planifié vers la ville de votre client.",
    },
    {
      step: 3,
      icon: Camera,
      title: "Remise encadrée",
      text: "Photo au départ, messagerie pour le rendez-vous, sans donner vos coordonnées personnelles au client final.",
    },
    {
      step: 4,
      icon: ShieldCheck,
      title: "Le client confirme par OTP",
      text: "La livraison est validée à la réception. Vous suivez l'échange jusqu'au code secret.",
    },
  ],
  ctaLabel: "Envoyer un colis",
  ctaHref: "/recherche?type=PARCEL",
  closingTitle: "Publiez un envoi pour vos clients en région.",
  closingText:
    "Une option souple quand le transporteur classique est trop lent ou trop cher pour un colis isolé.",
  trust: SENDER_TRUST,
};

const CONDUCTEUR_REGULIER: HowItWorksProfile = {
  heading: "Je prends souvent la route",
  intro:
    "Travailleur régional, étudiant, navetteur : vos trajets réguliers (route 117, Abitibi, Gatineau, Montréal) peuvent transporter des colis. Ce n'est pas une flotte professionnelle. C'est votre véhicule, déjà en déplacement.",
  imageSrc: "/brand/axio-covoiturage.png",
  imageAlt: "Axio — Conducteur régulier Livre-moi.ca",
  stepsTitle: "Transformez vos trajets habituels en gains",
  steps: [
    {
      step: 1,
      icon: Repeat,
      title: "Enregistrez vos trajets habituels",
      text: "Indiquez les liaisons que vous faites souvent, avec l'espace coffre ou banquette disponible.",
    },
    {
      step: 2,
      icon: Briefcase,
      title: "Recevez des demandes récurrentes",
      text: "Les expéditeurs voient vos passages réguliers et vous proposent des colis sur ces mêmes axes.",
    },
    {
      step: 3,
      icon: Truck,
      title: "Remplissez le coffre sans changer vos habitudes",
      text: "Vous acceptez seulement ce qui entre dans votre véhicule et dans votre horaire.",
    },
    {
      step: 4,
      icon: HandCoins,
      title: "Amortissez l'essence à chaque passage",
      text: "OTP à la livraison, paiement débloqué. Un colis de plus sur un trajet que vous faisiez déjà.",
    },
  ],
  ctaLabel: "Proposer mes trajets",
  ctaHref: "/livrer",
  closingTitle: "Proposez vos trajets réguliers et remplissez le coffre.",
  closingText:
    "Plus vous passez souvent, plus les expéditeurs peuvent s'appuyer sur votre route. Toujours sur un déplacement déjà prévu.",
  trust: DRIVER_TRUST,
};

export function HowItWorksSection() {
  return (
    <section
      id="fonctionnement"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:py-20"
    >
      <SectionHeader
        badge="Livre-moi.ca s'adapte à tous les profils"
        title="Comment ça marche ?"
        subtitle="Une façon simple, économique et humaine de faire voyager vos colis sur des trajets déjà prévus."
      />

      <AnimatedTabs
        tabs={[
          {
            title: "Particulier expéditeur",
            value: "sender",
            content: <HowItWorksProfilePanel {...PARTICULIER_EXPEDITEUR} />,
          },
          {
            title: "Particulier conducteur",
            value: "driver",
            content: <HowItWorksProfilePanel {...PARTICULIER_CONDUCTEUR} />,
          },
          {
            title: "Commerce expéditeur",
            value: "business",
            content: <HowItWorksProfilePanel {...COMMERCE_EXPEDITEUR} />,
          },
          {
            title: "Conducteur régulier",
            value: "regular",
            content: <HowItWorksProfilePanel {...CONDUCTEUR_REGULIER} />,
          },
        ]}
        containerClassName="mx-auto grid w-full max-w-4xl grid-cols-2 justify-center gap-2 overflow-visible rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-4"
        tabClassName="w-full rounded-xl px-3 py-2.5 text-center text-sm font-bold sm:text-[15px]"
        activeTabClassName="rounded-xl"
        layoutId="how-it-works-colis-tab"
      />
    </section>
  );
}
