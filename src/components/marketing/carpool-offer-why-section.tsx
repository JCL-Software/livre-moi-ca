import { HandCoins, MapPin, Users } from "lucide-react";
import { GradientFeatureCard } from "@/components/marketing/gradient-feature-card";
import { SectionHeader } from "@/components/marketing/section-header";

const REASONS = [
  {
    icon: HandCoins,
    title: "Partagez les frais d'essence",
    text: "Les passagers contribuent à vos dépenses de route — un moyen simple de rentabiliser chaque déplacement.",
    accent: "from-orange-600/90 to-amber-700/90",
  },
  {
    icon: MapPin,
    title: "Aucun trajet supplémentaire",
    text: "Vous proposez uniquement les places libres sur les déplacements que vous aviez déjà prévus.",
    accent: "from-[#1E3A5F]/95 to-[#1a4a7a]/95",
  },
  {
    icon: Users,
    title: "Voyagez en bonne compagnie",
    text: "Profils vérifiés, avis communautaires et messagerie intégrée pour des trajets sereins.",
    accent: "from-emerald-700/90 to-teal-800/90",
  },
];

export function CarpoolOfferWhySection() {
  return (
    <section className="border-b border-slate-200 bg-[#fffaf1] py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Pourquoi proposer"
          title="Vous ne devenez pas chauffeur de taxi. Vous partagez simplement la route que vous faites déjà."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {REASONS.map((reason) => (
            <GradientFeatureCard key={reason.title} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
