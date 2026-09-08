import { Briefcase, Car, GraduationCap, Heart } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { SectionHeader } from "@/components/marketing/section-header";

const PROFILES = [
  { icon: GraduationCap, label: "Étudiant" },
  { icon: Briefcase, label: "Travailleur régional" },
  { icon: Car, label: "Conducteur fréquent" },
  { icon: Heart, label: "Visite en famille" },
];

export function CarpoolOfferProfilesSection() {
  return (
    <section className="section-muted py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          badge="Qui peut proposer"
          title="Si vous roulez déjà entre nos villes, vous pouvez proposer des places avec Livre-moi.ca."
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROFILES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="feature-card flex flex-col items-center rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm before:hidden dark:border-white/10 dark:bg-neutral-900"
            >
              <AnimateIcon animateOnView className="mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
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
