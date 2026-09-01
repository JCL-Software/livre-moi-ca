import { CarpoolHeroSection } from "@/components/marketing/carpool-hero-section";
import { CarpoolHowItWorksSection } from "@/components/marketing/carpool-how-it-works-section";
import { CarpoolWhySection } from "@/components/marketing/carpool-why-section";
import { CarpoolRoutesSection } from "@/components/marketing/carpool-routes-section";
import { CarpoolComfortSection } from "@/components/marketing/carpool-comfort-section";
import { CarpoolFaqSection } from "@/components/marketing/carpool-faq-section";
import { CarpoolCtaSection } from "@/components/marketing/carpool-cta-section";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Covoiturage en Abitibi-Témiscamingue`,
  description: `Covoiturage simple, économique et fiable sur la route 117 avec ${APP_NAME}. Trouvez ou proposez des places entre l'Abitibi, Montréal et Gatineau.`,
};

export default function CovoituragePage() {
  return (
    <div>
      <CarpoolHeroSection />
      <CarpoolHowItWorksSection />
      <CarpoolWhySection />
      <CarpoolRoutesSection />
      <CarpoolComfortSection />
      <CarpoolFaqSection />
      <CarpoolCtaSection />
    </div>
  );
}
