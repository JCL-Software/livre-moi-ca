import { UberHome } from "@/components/baseweb/uber-home";
import { DeliverWhySection } from "@/components/marketing/deliver-why-section";
import { DeliverHowSection } from "@/components/marketing/deliver-how-section";
import { DeliverProfilesSection } from "@/components/marketing/deliver-profiles-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { DeliverFaqSection } from "@/components/marketing/deliver-faq-section";
import { DeliverCtaSection } from "@/components/marketing/deliver-cta-section";
import { APP_NAME } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livrer et gagner",
  description: `Transportez des colis sur vos trajets existants avec ${APP_NAME}. Rentabilisez l'espace dans votre véhicule sans détour inutile, au Québec et en Ontario.`,
};

export default function LivrerPage() {
  return (
    <div>
      <UberHome mode="drive" />
      <DeliverWhySection />
      <DeliverHowSection />
      <DeliverProfilesSection />
      <TrustSection />
      <DeliverFaqSection />
      <DeliverCtaSection />
    </div>
  );
}
