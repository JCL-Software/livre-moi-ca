import { MapPin } from "@/components/animate-ui/icons/map-pin";
import { Users } from "@/components/animate-ui/icons/users";
import { HandCoinsIcon } from "@/components/ui/hand-coins";
import { GradientFeatureCard } from "@/components/marketing/gradient-feature-card";
import { SectionHeader } from "@/components/marketing/section-header";

const REASONS = [
  {
    icon: HandCoinsIcon,
    title: "Partagez les frais d'essence",
    text: "Les passagers contribuent à vos dépenses de route — Un moyen simple de rentabiliser chaque déplacement.",
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
    <section className="section-muted py-16 md:py-20">
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
