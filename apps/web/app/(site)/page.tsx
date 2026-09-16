import { UberHome } from "@/components/baseweb/uber-home";
import { EcologySection } from "@/components/marketing/ecology-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { ParcelFormatsSection } from "@/components/marketing/parcel-formats-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";

export default function HomePage() {
  return (
    <div>
      <UberHome mode="parcel" />
      <EcologySection />
      <HowItWorksSection />
      <UseCasesSection />
      <ParcelFormatsSection />
      <TrustSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
}
