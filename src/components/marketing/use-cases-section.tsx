import { Leaf, ShoppingBag, Wrench, Mail } from "lucide-react";
import { GradientFeatureCard } from "@/components/marketing/gradient-feature-card";
import { SectionHeader } from "@/components/marketing/section-header";

const USE_CASES = [
  {
    icon: ShoppingBag,
    title: "Achats Facebook Marketplace & Kijiji",
    text: "Vous avez trouvé un meuble ou un outil rare à Val-d'Or mais vous habitez à La Sarre ? Ne laissez plus passer une bonne affaire à cause de la distance.",
    accent: "from-orange-500/90 to-amber-600/90",
  },
  {
    icon: Wrench,
    title: "Dépannages & Pièces urgentes",
    text: "Besoin d'une pièce mécanique, d'un équipement ou de matériel de travail envoyé le jour même entre deux villes de la région sans attendre la fin de semaine.",
    accent: "from-sky-600/90 to-blue-700/90",
  },
  {
    icon: Mail,
    title: "Documents, clés et effets personnels",
    text: "Un oubli important à Montréal ou un dossier à transmettre rapidement à Rouyn-Noranda ? Vos voisins de route s'en chargent en toute confiance.",
    accent: "from-violet-600/90 to-purple-700/90",
  },
  {
    icon: Leaf,
    title: "Économique et écologique",
    text: "Le conducteur amortit le prix de son essence sur la route 117 et l'expéditeur paie une fraction du tarif des gros transporteurs, sans camion supplémentaire sur la route.",
    accent: "from-emerald-600/90 to-teal-700/90",
  },
];

export function UseCasesSection() {
  return (
    <section className="border-y border-slate-200 bg-[#fffaf1] py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Cas d'usage"
          title="Pourquoi utiliser Livre-moi.ca au quotidien ?"
          subtitle="Ne payez plus le prix fort des transporteurs traditionnels et évitez les délais de 3 à 5 jours ouvrables."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {USE_CASES.map((useCase) => (
            <GradientFeatureCard key={useCase.title} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  );
}
