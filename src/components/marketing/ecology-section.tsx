import type { LucideIcon } from "lucide-react";
import { Car, Leaf, Package, Route, Users } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

type EcologyVariant = "colis" | "covoiturage";

const CONTENT: Record<
  EcologyVariant,
  {
    subtitle: string;
    description: string;
    points: { icon: LucideIcon; title: string; description: string }[];
  }
> = {
  colis: {
    subtitle: "Transformez vos trajets en actions écologiques concrètes",
    description: `${APP_NAME} valorise les trajets existants pour rendre l'envoi de colis plus utile, plus simple et plus responsable.`,
    points: [
      {
        icon: Car,
        title: "Moins de véhicules",
        description:
          "Le covoiturage remplit les places déjà disponibles au lieu d'ajouter des départs à vide.",
      },
      {
        icon: Package,
        title: "Colis sur trajets existants",
        description:
          "Les envois profitent des trajets planifiés — sans camion dédié ni livraison express inutile.",
      },
      {
        icon: Route,
        title: "Corridor optimisé",
        description:
          "Route 117 et arrêts intermédiaires : chaque kilomètre parcouru sert passagers et colis.",
      },
    ],
  },
  covoiturage: {
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
  const { subtitle, description, points } = CONTENT[variant];

  const card = (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 via-sky-100 to-cyan-200 p-5 shadow-sm ring-1 ring-sky-200 dark:from-sky-950 dark:via-slate-900 dark:to-cyan-950 dark:ring-sky-900 md:p-7 lg:p-8">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-300/35 blur-3xl dark:bg-cyan-500/20" />
      <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-sky-300/45 blur-3xl dark:bg-sky-500/20" />

      <div className="relative grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-6">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-slate-950/50 dark:text-emerald-300">
            <Leaf className="h-3 w-3" />
            Écologie
          </div>

          <div className="flex items-center gap-2">
            <h2 className="font-space text-2xl font-black italic tracking-tight text-slate-950 dark:text-slate-50 md:text-3xl">
              Chaque trajet compte
            </h2>
            <Leaf className="h-5 w-5 shrink-0 rotate-12 text-emerald-500 dark:text-emerald-400 md:h-6 md:w-6" />
          </div>

          <p className="mt-2.5 max-w-md text-sm leading-6 text-slate-700 dark:text-slate-300 md:text-[15px]">
            {subtitle}
          </p>
          <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-600 dark:text-slate-400 md:text-sm md:leading-6">
            {description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {points.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-white bg-white/80 p-3.5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/60 md:p-4"
            >
              <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                <point.icon className="h-4 w-4" />
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
    <section className="bg-white py-10 dark:bg-slate-950 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{card}</div>
    </section>
  );
}
