import { Briefcase, Car } from "lucide-react";
import { Users } from "@/components/animate-ui/icons/users";
import { GraduationCapIcon } from "@/components/ui/graduation-cap";
import { SectionHeader } from "@/components/marketing/section-header";

type AppIcon = React.ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

const PROFILES: { icon: AppIcon; label: string }[] = [
  { icon: GraduationCapIcon, label: "Étudiant" },
  { icon: Briefcase, label: "Travailleur régional" },
  { icon: Car, label: "Conducteur fréquent" },
  { icon: Users, label: "Covoitureur occasionnel" },
];

export function DeliverProfilesSection() {
  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Qui peut livrer"
          title="Si vous faites déjà le trajet, vous pouvez livrer avec Livre-moi.ca."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROFILES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="feature-card flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm before:hidden dark:border-white/10 dark:bg-neutral-900"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                <Icon className="h-5 w-5" size={20} animateOnHover />
              </span>
              <p className="text-sm font-semibold text-black dark:text-white md:text-base">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
