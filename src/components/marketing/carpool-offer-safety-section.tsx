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
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Sécurité"
          title="Un cadre clair pour proposer des places en toute confiance."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {SAFETY_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-500/5 transition-transform group-hover:scale-150" />
              <AnimateIcon animateOnView className="relative mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A5F] text-orange-400">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
              <h3 className="relative font-space text-lg font-bold text-slate-950 dark:text-white">
                {title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
