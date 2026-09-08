import { Backpack, Briefcase, Container, Package } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";

const FORMATS = [
  {
    size: "S",
    label: "Petit format — Enveloppe ou petit sac",
    icon: Briefcase,
    ideal: "Documents, clés, petits accessoires, vêtements légers et petits appareils électroniques.",
    placement: "Se glisse facilement sous un siège ou dans un petit espace du coffre.",
    color: "text-sky-700 dark:text-sky-300",
  },
  {
    size: "M",
    label: "Format moyen — Boîte à chaussures",
    icon: Backpack,
    ideal: "Livres, vêtements, petits colis Marketplace, accessoires et objets du quotidien.",
    placement: "Peut être placé dans le coffre ou sur un siège, selon l'espace disponible.",
    color: "text-orange-700 dark:text-orange-300",
  },
  {
    size: "L",
    label: "Grand format — Carton ou petite valise",
    icon: Package,
    ideal: "Petits meubles démontés, outils, équipement de plein air et cartons de déménagement légers.",
    placement: "Nécessite un espace libre dans le coffre ou dans l'habitacle.",
    color: "text-violet-700 dark:text-violet-300",
  },
  {
    size: "XL",
    label: "Très grand format — Plusieurs boîtes ou équipement volumineux",
    icon: Container,
    ideal: "Équipement sportif, objets volumineux, plusieurs cartons ou articles nécessitant une grande partie du coffre.",
    placement: "À confirmer directement avec le conducteur avant la réservation.",
    color: "text-emerald-700 dark:text-emerald-300",
  },
];

export function ParcelFormatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <SectionHeader
        badge="Formats acceptés"
        title="Quels formats pouvez-vous faire livrer ?"
        subtitle="Tout ce qui tient dans un véhicule standard, du format enveloppe au coffre plein."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map(({ size, label, icon: Icon, ideal, placement, color }) => (
          <article
            key={size}
            className="feature-card flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm before:hidden dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className={`inline-flex ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
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
        Les matières dangereuses, les armes, les produits illégaux, les articles mal
        emballés et les denrées périssables qui ne peuvent pas être transportées de
        façon sécuritaire ne sont pas acceptés.
      </p>
    </section>
  );
}
