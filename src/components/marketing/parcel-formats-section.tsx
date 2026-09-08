import { Backpack, Briefcase, Container, Package } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";

const FORMATS = [
  {
    size: "S",
    label: "Petit format — Enveloppe ou petit sac",
    icon: Briefcase,
    ideal: "Documents, clés, petits accessoires, vêtements légers et petits appareils électroniques.",
    placement: "Se glisse facilement sous un siège ou dans un petit espace du coffre.",
    color: "text-black dark:text-white",
  },
  {
    size: "M",
    label: "Format moyen — Boîte à chaussures",
    icon: Backpack,
    ideal: "Livres, vêtements, petits colis Marketplace, accessoires et objets du quotidien.",
    placement: "Peut être placé dans le coffre ou sur un siège, selon l'espace disponible.",
    color: "text-black dark:text-white",
  },
  {
    size: "L",
    label: "Grand format — Carton ou petite valise",
    icon: Package,
    ideal: "Petits meubles démontés, outils, équipement de plein air et cartons de déménagement légers.",
    placement: "Nécessite un espace libre dans le coffre ou dans l'habitacle.",
    color: "text-black dark:text-white",
  },
  {
    size: "XL",
    label: "Très grand format — Plusieurs boîtes ou équipement volumineux",
    icon: Container,
    ideal: "Équipement sportif, objets volumineux, plusieurs cartons ou articles nécessitant une grande partie du coffre.",
    placement: "À confirmer directement avec le conducteur avant la réservation.",
    color: "text-black dark:text-white",
  },
];

export function ParcelFormatsSection() {
  return (
    <section className="section-plain py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
      <SectionHeader
        badge="Formats acceptés"
        title="Quels formats pouvez-vous faire livrer ?"
        subtitle="Tout ce qui tient dans un véhicule standard, du format enveloppe au coffre plein."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FORMATS.map(({ size, label, icon: Icon, ideal, placement, color }) => (
          <article
            key={size}
            className="feature-card flex flex-col rounded-lg border border-neutral-200 bg-card p-6 shadow-sm before:hidden dark:border-white/10 dark:bg-card"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] dark:bg-neutral-800 ${color}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-xs font-semibold text-black dark:bg-white/10 dark:text-neutral-300">
                Format {size}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
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

      <p className="mt-8 rounded-xl border border-neutral-200 bg-[#F6F6F6] px-4 py-3 text-center text-sm font-medium text-neutral-800 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200">
        Les matières dangereuses, les armes, les produits illégaux, les articles mal
        emballés et les denrées périssables qui ne peuvent pas être transportées de
        façon sécuritaire ne sont pas acceptés.
      </p>
      </div>
    </section>
  );
}
