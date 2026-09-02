import { HeroSection } from "@/components/marketing/hero-section";
import { EcologySection } from "@/components/marketing/ecology-section";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { UseCasesSection } from "@/components/marketing/use-cases-section";
import { ParcelFormatsSection } from "@/components/marketing/parcel-formats-section";
import { TrustSection } from "@/components/marketing/trust-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { SearchForm } from "@/components/search/search-form";
import { CORRIDOR_CITIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <EcologySection />

      <HowItWorksSection />

      <UseCasesSection />

      <ParcelFormatsSection />

      <TrustSection />

      <section className="bg-[#fffaf1] dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
                Zone desservie
              </p>
              <h2 className="mt-4 font-space text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">
                Corridor desservi
              </h2>
              <div className="mt-4 h-1 w-20 rounded-full bg-orange-500" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              De l&apos;Abitibi jusqu&apos;à Montréal via la route 117
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {CORRIDOR_CITIES.map((city) => (
              <span
                key={city.name}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {city.name}
              </span>
            ))}
          </div>
        </div>
      </section>

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
              Indiquez votre départ, votre destination et la date — on vous met en
              relation avec un conducteur de la région.
            </p>
          </div>
          <SearchForm defaultType="PARCEL" />
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
