import { Car, Package } from "lucide-react";
import { Route } from "@/components/animate-ui/icons/route";
import { Users } from "@/components/animate-ui/icons/users";
import { LeafIcon } from "@/components/ui/leaf";
import { APP_NAME } from "@/lib/constants";

type AppIcon = React.ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

type EcologyVariant = "colis" | "covoiturage";

const CONTENT: Record<
  EcologyVariant,
  {
    badge: string;
    title: string;
    subtitle: string;
    description?: string;
    points: { icon: AppIcon; title: string; description: string }[];
  }
> = {
  colis: {
    badge: "Un trajet peut servir à plus",
    title: "Votre colis profite d'un trajet qui existe déjà",
    subtitle:
      "Au lieu d'ajouter un véhicule sur la route, Livre-moi.ca utilise les déplacements déjà prévus. Votre colis avance, le conducteur rentabilise son trajet et la communauté évite des déplacements supplémentaires.",
    points: [
      {
        icon: Car,
        title: "Un trajet, deux utilités",
        description:
          "Le conducteur se déplace déjà. Votre colis profite simplement de l'espace disponible dans son véhicule.",
      },
      {
        icon: Package,
        title: "Une livraison qui rapproche",
        description:
          "Faites circuler vos achats, vos effets personnels ou vos pièces importantes entre les villes.",
      },
      {
        icon: LeafIcon,
        title: "Une option plus responsable",
        description:
          "Optimiser les trajets existants permet de limiter les déplacements consacrés uniquement à la livraison.",
      },
    ],
  },
  covoiturage: {
    badge: "Écologie",
    title: "Chaque trajet compte",
    subtitle: "Transformez vos déplacements en actions écologiques concrètes",
    description: `${APP_NAME} facilite le partage de véhicules déjà en route pour rendre le covoiturage plus accessible, plus économique et plus responsable.`,
    points: [
      {
        icon: Users,
        title: "Sièges partagés",
        description:
          "Chaque place occupée évite qu'un autre conducteur parte seul sur la même route.",
      },
      {
        icon: Car,
        title: "Moins d'émissions",
        description:
          "Répartir les kilomètres entre plusieurs passagers réduit l'empreinte carbone par personne.",
      },
      {
        icon: Route,
        title: "Trajets déjà planifiés",
        description:
          "Pas de véhicule supplémentaire : vous profitez d'un déplacement qui aurait lieu de toute façon.",
      },
    ],
  },
};

export function EcologySection({ variant = "colis" }: { variant?: EcologyVariant }) {
  const { badge, title, subtitle, description, points } = CONTENT[variant];

  const card = (
    <div className="relative overflow-hidden rounded-lg bg-[#F6F6F6] p-5 shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 md:p-7 lg:p-8">
      <div className="relative grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-6">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black dark:border-white/15 dark:bg-black dark:text-white">
            <LeafIcon className="h-3 w-3" size={12} />
            {badge}
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white md:text-3xl">
              {title}
            </h2>
            <LeafIcon className="h-5 w-5 shrink-0 text-black dark:text-white md:h-6 md:w-6" size={20} />
          </div>

          <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-700 dark:text-slate-300 md:text-[15px]">
            {subtitle}
          </p>
          {description ? (
            <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-600 dark:text-slate-400 md:text-sm md:leading-6">
              {description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-lg border border-white bg-white p-3.5 shadow-sm dark:border-neutral-700 dark:bg-black md:p-4"
            >
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F3F3] text-black dark:bg-white/10 dark:text-white">
                <point.icon className="h-4 w-4" size={16} animateOnHover />
              </div>
              <h3 className="text-xs font-extrabold text-slate-950 dark:text-slate-50 md:text-sm">
                {point.title}
              </h3>
              <p className="mt-1 text-[11px] leading-4 text-slate-600 dark:text-slate-400 md:text-xs md:leading-5">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-transparent py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{card}</div>
    </section>
  );
}
