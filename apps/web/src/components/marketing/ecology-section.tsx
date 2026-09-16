import type { ComponentType, SVGProps } from "react";
import { Car, Package } from "lucide-react";
import { Route } from "@/components/animate-ui/icons/route";
import { Users } from "@/components/animate-ui/icons/users";
import { LeafIcon } from "@/components/ui/leaf";
import { UberCard, UberIconTile, UberTag } from "@/components/baseweb/uber-ui";
import { APP_NAME } from "@/lib/constants";

type AppIcon = ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

function withoutHoverProp(
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>,
): AppIcon {
  return function StaticIcon({ animateOnHover: _animateOnHover, ...props }) {
    return <Icon {...props} />;
  };
}

const CarIcon = withoutHoverProp(Car);
const PackageIcon = withoutHoverProp(Package);

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
        icon: CarIcon,
        title: "Un trajet, deux utilités",
        description:
          "Le conducteur se déplace déjà. Votre colis profite simplement de l'espace disponible dans son véhicule.",
      },
      {
        icon: PackageIcon,
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
        icon: CarIcon,
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
    <UberCard padded={false} className="overflow-hidden">
      <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-6 md:p-7 lg:p-8">
        <div>
          <UberTag>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <LeafIcon className="h-3 w-3" size={12} />
              {badge}
            </span>
          </UberTag>

          <div className="mt-2.5 flex items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
              {title}
            </h2>
            <LeafIcon className="h-5 w-5 shrink-0 text-black md:h-6 md:w-6" size={20} />
          </div>

          <p className="mt-2.5 mb-0 max-w-md text-sm leading-6 text-slate-700 md:text-[15px]">
            {subtitle}
          </p>
          {description ? (
            <p className="mt-1.5 mb-0 max-w-md text-xs leading-5 text-slate-600 md:text-sm md:leading-6">
              {description}
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {points.map((point) => (
            <UberCard key={point.title}>
              <UberIconTile size={32}>
                <point.icon className="h-4 w-4" size={16} />
              </UberIconTile>
              <h3 className="pt-2 text-xs font-extrabold text-slate-950 md:text-sm">
                {point.title}
              </h3>
              <p className="pt-1 text-[11px] leading-4 text-slate-600 md:text-xs md:leading-5">
                {point.description}
              </p>
            </UberCard>
          ))}
        </div>
      </div>
    </UberCard>
  );

  return (
    <section className="bg-transparent py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{card}</div>
    </section>
  );
}
