import { Package, ShieldCheck, Users } from "lucide-react";
import { EcologySection } from "@/components/marketing/ecology-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { SearchForm } from "@/components/search/search-form";
import { APP_NAME, CORRIDOR_CITIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      <HeroSection />

      <EcologySection />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 max-w-3xl text-center md:mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
            Comment ça marche
          </p>
          <h2 className="mt-5 font-space text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Covoiturage et cotransportage, simple et local
          </h2>
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-orange-500" />
          <p className="mt-4 text-muted-foreground">
            Une plateforme pensée pour le corridor abitibien — sans boîte noire payante.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Covoiturage régional",
              text: "Places passagers, arrêts sur le corridor et matching spatial PostGIS à 25 km.",
            },
            {
              icon: Package,
              title: "Livraison de colis",
              text: "Photo d'état, prise en charge, puis validation obligatoire par code OTP à 6 chiffres.",
            },
            {
              icon: ShieldCheck,
              title: "Ouvert et fiable",
              text: "OpenStreetMap, Nominatim, OSRM / OpenRouteService et Supabase. Zéro Google Maps.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="feature-card rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="font-space text-lg font-bold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
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
              Indiquez votre départ, votre destination et la date — on s&apos;occupe du matching.
            </p>
          </div>
          <SearchForm />
        </div>
      </section>

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
    </div>
  );
}
