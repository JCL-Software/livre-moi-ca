import { HeroSection } from "@/components/marketing/hero-section";
import { EcologySection } from "@/components/marketing/ecology-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { ParcelFormatsSection } from "@/components/marketing/parcel-formats-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { EstimationSection } from "@/components/marketing/estimation-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <EcologySection />

      <HowItWorksSection />

      <UseCasesSection />

      <ParcelFormatsSection />

      <TrustSection />

      <FaqSection />

      <EstimationSection />

      <CtaSection />
    </div>
  );
}
