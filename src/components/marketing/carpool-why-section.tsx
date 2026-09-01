import { Package, Shield, Trees, Luggage } from "lucide-react";
import { GradientFeatureCard } from "@/components/marketing/gradient-feature-card";
import { SectionHeader } from "@/components/marketing/section-header";

const REASONS = [
  {
    icon: Shield,
    title: "Fini les désistements sans préavis",
    text: "Sur les réseaux sociaux, un passager sur deux annule sans payer. Avec notre système de réservation préalable, vos places réservées sont garanties et protégées.",
    accent: "from-[#1E3A5F]/95 to-[#1a4a7a]/95",
  },
  {
    icon: Trees,
    title: "Pensé pour la traversée de La Vérendrye",
    text: "Points de rencontre clairs avant la perte de réseau cellulaire (Mont-Laurier, Grand-Remous, Louvicourt) et coordination transparente dès le départ.",
    accent: "from-emerald-700/90 to-teal-800/90",
  },
  {
    icon: Luggage,
    title: "Espace bagages garanti et clair",
    text: "Sacs de sport, équipements de travail ou valises d'étudiants : chaque annonce précise exactement la place disponible dans le coffre pour éviter les mauvaises surprises.",
    accent: "from-violet-700/90 to-purple-800/90",
  },
  {
    icon: Package,
    title: "Maximisez vos revenus (Passagers + Colis)",
    text: "Vous avez 2 passagers et encore de la place dans le coffre ? Complétez avec un petit colis Livre-moi.ca pour rentabiliser à 100 % votre aller-retour.",
    accent: "from-orange-600/90 to-amber-700/90",
  },
];

export function CarpoolWhySection() {
  return (
    <section className="border-y border-slate-200 bg-[#fffaf1] py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Pourquoi nous choisir"
          title="Pourquoi choisir Livre-moi.ca plutôt qu'un groupe Facebook ?"
          subtitle="Dites adieu aux annulations de dernière minute et aux faux profils."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {REASONS.map((reason) => (
            <GradientFeatureCard key={reason.title} {...reason} />
          ))}
        </div>
      </div>
    </section>
  );
}
