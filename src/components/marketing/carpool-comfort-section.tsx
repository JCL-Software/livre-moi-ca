import {
  CreditCard,
  Dog,
  Music,
  ShieldCheck,
  Snowflake,
  UserCheck,
} from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const COMFORT_POINTS = [
  {
    icon: UserCheck,
    title: "Profils vérifiés à 100 %",
    text: "Téléphone, identité et avis laissés après chaque trajet pour voyager l'esprit tranquille.",
  },
  {
    icon: Music,
    title: "Préférences de voyage personnalisées",
    text: "Animaux acceptés ou non, véhicule non-fumeur, envie de jaser ou voyage calme, ambiance musicale ou silence — tout est indiqué sur chaque annonce.",
  },
  {
    icon: Snowflake,
    title: "Conduite hivernale prudente",
    text: "Des conducteurs habitués aux conditions routières de nos hivers témiscabitibiens.",
  },
  {
    icon: CreditCard,
    title: "Paiement sans manipulation d'argent comptant",
    text: "Tout se règle de manière fluide et sécurisée via l'application.",
  },
];

const PREFERENCE_TAGS = [
  { icon: Dog, label: "Animaux acceptés ou non" },
  { icon: ShieldCheck, label: "Véhicule non-fumeur" },
  { icon: Music, label: "Jaser ou voyage calme" },
];

export function CarpoolComfortSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Confiance & confort"
          title="Voyagez selon vos préférences"
          subtitle="Une communauté basée sur le respect, la ponctualité et la convivialité."
        />

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {PREFERENCE_TAGS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <Icon className="h-4 w-4 text-orange-500" />
              {label}
            </span>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {COMFORT_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="feature-card rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
            >
              <AnimateIcon animateOnView className="mb-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E3A5F] text-orange-400">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
              <h3 className="font-space text-lg font-bold text-slate-950 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
