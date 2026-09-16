import { UberHome } from "@/components/baseweb/uber-home";
import { CarpoolOfferWhySection } from "@/components/marketing/carpool-offer-why-section";
import { CarpoolOfferHowSection } from "@/components/marketing/carpool-offer-how-section";
import { CarpoolOfferProfilesSection } from "@/components/marketing/carpool-offer-profiles-section";
import { CarpoolOfferSafetySection } from "@/components/marketing/carpool-offer-safety-section";
import { CarpoolOfferFaqSection } from "@/components/marketing/carpool-offer-faq-section";
import { CarpoolOfferCtaSection } from "@/components/marketing/carpool-offer-cta-section";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposer des places",
  description: `Partagez les places libres de votre véhicule avec ${APP_NAME}. Réduisez vos frais d'essence sur les trajets que vous faites déjà, au Québec et en Ontario.`,
};

export default function CovoiturageProposerPage() {
  return (
    <div>
      <UberHome mode="drive" intent="seats" />
      <CarpoolOfferWhySection />
      <CarpoolOfferHowSection />
      <CarpoolOfferProfilesSection />
      <CarpoolOfferSafetySection />
      <CarpoolOfferFaqSection />
      <CarpoolOfferCtaSection />
    </div>
  );
}
