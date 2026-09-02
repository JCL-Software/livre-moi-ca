import { Briefcase, Car, GraduationCap, Users } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const PROFILES = [
  { icon: GraduationCap, label: "Étudiant" },
  { icon: Briefcase, label: "Travailleur régional" },
  { icon: Car, label: "Conducteur fréquent" },
  { icon: Users, label: "Covoitureur occasionnel" },
];

export function DeliverProfilesSection() {
  return (
    <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Qui peut livrer"
          title="Si vous faites déjà le trajet, vous pouvez livrer avec Livre-moi.ca."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROFILES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="feature-card flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900"
            >
              <AnimateIcon animateOnView className="mb-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                  <Icon className="h-6 w-6" />
                </span>
              </AnimateIcon>
              <p className="font-space text-sm font-bold text-slate-950 dark:text-white md:text-base">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
