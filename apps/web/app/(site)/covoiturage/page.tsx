import { CarpoolHeroSection } from "@/components/marketing/carpool-hero-section";
import { CarpoolTrustStrip } from "@/components/marketing/carpool-trust-strip";
import { CarpoolSafetySection } from "@/components/marketing/carpool-safety-section";
import { CarpoolKycSection } from "@/components/marketing/carpool-kyc-section";
import { CarpoolHowItWorksSection } from "@/components/marketing/carpool-how-it-works-section";
import { CarpoolBookingInfoSection } from "@/components/marketing/carpool-booking-info-section";
import { CarpoolShareSection } from "@/components/marketing/carpool-share-section";
import { CarpoolColisTransition } from "@/components/marketing/carpool-colis-transition";
import { CarpoolFaqSection } from "@/components/marketing/carpool-faq-section";
import { CarpoolCtaSection } from "@/components/marketing/carpool-cta-section";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Covoiturage au Québec et en Ontario`,
  description: `Trouvez une place ou partagez vos sièges libres avec ${APP_NAME}. Conducteurs vérifiés, réservation claire et trajets régionaux entre le Québec et l'Ontario.`,
};

export default function CovoituragePage() {
  return (
    <div>
      <CarpoolHeroSection />
      <CarpoolTrustStrip />
      <CarpoolSafetySection />
      <CarpoolKycSection />
      <CarpoolBookingInfoSection />
      <CarpoolHowItWorksSection />
      <CarpoolShareSection />
      <CarpoolColisTransition />
      <CarpoolFaqSection />
      <CarpoolCtaSection />
    </div>
  );
}
