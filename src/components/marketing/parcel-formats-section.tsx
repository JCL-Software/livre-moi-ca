import { Backpack, Briefcase, Package } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const FORMATS = [
  {
    size: "S",
    label: "Petit format (Enveloppe / Pochette)",
    icon: Briefcase,
    ideal: "Clés, documents officiels, passeport, bijoux, petits accessoires électroniques.",
    placement: "Boîte à gants ou console centrale.",
    color: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    size: "M",
    label: "Format moyen (Boîte à chaussures / Sac à dos)",
    icon: Backpack,
    ideal: "Vêtements, pièces électroniques, petits colis Marketplace, livres.",
    placement: "Au sol ou sur la banquette passager.",
    color: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300",
  },
  {
    size: "L",
    label: "Grand format (Carton standard / Petite valise)",
    icon: Package,
    ideal: "Petits meubles démontés, outillage, équipement de plein air, cartons de déménagement légers.",
    placement: "Coffre arrière du véhicule.",
    color: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300",
  },
];

export function ParcelFormatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Formats acceptés"
        title="Quels formats pouvez-vous faire livrer ?"
        subtitle="Tout ce qui tient dans un véhicule standard, du format enveloppe au carton de coffre."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {FORMATS.map(({ size, label, icon: Icon, ideal, placement, color }) => (
          <article
            key={size}
            className="feature-card flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <AnimateIcon animateOnView>
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl border ${color}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
              </AnimateIcon>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Format {size}
              </span>
            </div>
            <h3 className="font-space text-lg font-bold text-slate-950 dark:text-white">
              {label}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <p>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Idéal pour :
                </span>{" "}
                {ideal}
              </p>
              <p>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Emplacement :
                </span>{" "}
                {placement}
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
        Les matières dangereuses, produits illégaux, armes et denrées périssables
        non protégées sont strictement interdits.
      </p>
    </section>
  );
}
