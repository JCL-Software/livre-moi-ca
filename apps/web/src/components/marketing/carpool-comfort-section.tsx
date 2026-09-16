import { Dog, Music, Snowflake, UserCheck } from "lucide-react";
import { CreditCardIcon } from "@/components/ui/credit-card";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { SectionHeader } from "@/components/marketing/section-header";
import { withoutHoverProp } from "@/components/marketing/without-hover-prop";

const UserCheckIcon = withoutHoverProp(UserCheck);
const MusicIcon = withoutHoverProp(Music);
const SnowflakeIcon = withoutHoverProp(Snowflake);
const DogIcon = withoutHoverProp(Dog);

type AppIcon = React.ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

const COMFORT_POINTS: {
  icon: AppIcon;
  title: string;
  text: string;
}[] = [
  {
    icon: UserCheckIcon,
    title: "Profils vérifiés",
    text: "Téléphone, identité et avis laissés après chaque trajet pour voyager l'esprit tranquille.",
  },
  {
    icon: MusicIcon,
    title: "Préférences de voyage personnalisées",
    text: "Animaux acceptés ou non, véhicule non-fumeur, envie de jaser ou voyage calme, ambiance musicale ou silence — Tout est indiqué sur chaque annonce.",
  },
  {
    icon: SnowflakeIcon,
    title: "Conduite hivernale prudente",
    text: "Des conducteurs habitués aux conditions routières de nos hivers québécois et ontariens.",
  },
  {
    icon: CreditCardIcon,
    title: "Tarif affiché avant le départ",
    text: "Le paiement se fait en ligne. Pas d’échange d’argent comptant.",
  },
];

const PREFERENCE_TAGS: { icon: AppIcon; label: string }[] = [
  { icon: DogIcon, label: "Animaux acceptés ou non" },
  { icon: ShieldCheckIcon, label: "Véhicule non-fumeur" },
  { icon: MusicIcon, label: "Jaser ou voyage calme" },
];

export function CarpoolComfortSection() {
  return (
    <section className="section-muted py-16 md:py-20">
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
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <Icon className="h-4 w-4 text-black dark:text-white" size={16} animateOnHover />
              {label}
            </span>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {COMFORT_POINTS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="feature-card rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                <Icon className="h-5 w-5" size={20} animateOnHover />
              </span>
              <h3 className="text-[15px] font-semibold leading-snug text-black dark:text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-5 text-neutral-600 dark:text-neutral-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
