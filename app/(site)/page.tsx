import { HeroSection } from "@/components/marketing/hero-section";
import { EcologySection } from "@/components/marketing/ecology-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { ParcelFormatsSection } from "@/components/marketing/parcel-formats-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SearchForm } from "@/components/search/search-form";

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

      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 max-w-3xl text-center md:mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
              Rechercher
            </p>
            <h2 className="mt-5 font-space text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Trouvez un trajet ou confiez un colis
            </h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-orange-500" />
            <p className="mt-4 text-muted-foreground">
              Indiquez votre départ, votre destination et la date — On vous met en
              relation avec un conducteur au Québec ou en Ontario.
            </p>
          </div>
          <SearchForm defaultType="PARCEL" />
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
