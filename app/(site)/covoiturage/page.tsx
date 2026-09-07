import { CarpoolHeroSection } from "@/components/marketing/carpool-hero-section";
import { EcologySection } from "@/components/marketing/ecology-section";
import { CarpoolHowItWorksSection } from "@/components/marketing/carpool-how-it-works-section";
import { CarpoolWhySection } from "@/components/marketing/carpool-why-section";
import { CarpoolRoutesSection } from "@/components/marketing/carpool-routes-section";
import { CarpoolComfortSection } from "@/components/marketing/carpool-comfort-section";
import { CarpoolFaqSection } from "@/components/marketing/carpool-faq-section";
import { CarpoolCtaSection } from "@/components/marketing/carpool-cta-section";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Covoiturage au Québec et en Ontario`,
  description: `Covoiturage simple, économique et fiable avec ${APP_NAME}. Trouvez ou proposez des places entre les villes du Québec et de l'Ontario.`,
};

export default function CovoituragePage() {
  return (
    <div>
      <CarpoolHeroSection />
      <EcologySection variant="covoiturage" />
      <CarpoolHowItWorksSection />
      <CarpoolWhySection />
      <CarpoolRoutesSection />
      <CarpoolComfortSection />
      <CarpoolFaqSection />
      <CarpoolCtaSection />
    </div>
  );
}
