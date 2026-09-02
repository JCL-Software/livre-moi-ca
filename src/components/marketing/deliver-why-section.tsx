import { HandCoins, MapPin, ShieldCheck } from "lucide-react";
import { GradientFeatureCard } from "@/components/marketing/gradient-feature-card";
import { SectionHeader } from "@/components/marketing/section-header";

const REASONS = [
  {
    icon: HandCoins,
    title: "Gagnez un revenu complémentaire",
    text: "Soyez rémunéré en utilisant l'espace disponible dans votre coffre ou sur la banquette arrière.",
    accent: "from-orange-600/90 to-amber-700/90",
  },
  {
    icon: MapPin,
    title: "Aucun trajet supplémentaire",
    text: "Vous ne transportez des colis que sur les déplacements que vous aviez déjà prévus.",
    accent: "from-[#1E3A5F]/95 to-[#1a4a7a]/95",
  },
  {
    icon: ShieldCheck,
    title: "Livrez en toute confiance",
    text: "Profils vérifiés, paiement sécurisé et code OTP à la livraison pour chaque échange.",
    accent: "from-emerald-700/90 to-teal-800/90",
  },
];

export function DeliverWhySection() {
  return (
    <section className="border-b border-slate-200 bg-[#fffaf1] py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Pourquoi livrer"
          title="Vous ne devenez pas livreur professionnel. Vous rendez un trajet déjà prévu plus utile."
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
