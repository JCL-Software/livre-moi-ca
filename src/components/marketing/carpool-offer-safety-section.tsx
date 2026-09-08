import {
  MessageCircle,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const SAFETY_POINTS = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    text: "Vérification de l'identité, du numéro de téléphone et avis communautaires pour savoir avec qui vous partagez la route.",
  },
  {
    icon: Wallet,
    title: "Paiement sécurisé",
    text: "Les contributions des passagers sont gérées par la plateforme et versées après le trajet.",
  },
  {
    icon: MessageCircle,
    title: "Messagerie intégrée",
    text: "Coordonnez le point de rendez-vous sans divulguer vos informations personnelles.",
  },
  {
    icon: Star,
    title: "Avis après chaque trajet",
    text: "La communauté évalue chaque voyage pour maintenir un environnement de confiance.",
  },
];

export function CarpoolOfferSafetySection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Sécurité"
          title="Un cadre clair pour proposer des places en toute confiance."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {SAFETY_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="feature-card rounded-lg border border-neutral-200 bg-card p-6 shadow-sm dark:border-white/10 dark:bg-card"
            >
              <AnimateIcon animateOnView className="mb-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
