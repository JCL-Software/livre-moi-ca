import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { APP_TAGLINE, CORRIDOR_CITIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-6">
          <BrandLogo className="[&_span]:!text-white" />
          <p className="max-w-md text-lg leading-relaxed text-white/70">{APP_TAGLINE}</p>
          <p className="text-sm text-white/60">
            Corridor Rte 117 · Abitibi ↔ Laurentides ↔ Montréal
          </p>
        </div>

        <div>
          <h4 className="mb-6 font-space text-lg font-bold text-orange-400">Navigation</h4>
          <ul className="space-y-3 text-white/80">
            <li>
              <Link href="/recherche" className="transition-colors duration-300 hover:text-orange-400">
                Rechercher
              </Link>
            </li>
            <li>
              <Link
                href="/trajets/nouveau"
                className="transition-colors duration-300 hover:text-orange-400"
              >
                Publier un trajet
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="transition-colors duration-300 hover:text-orange-400">
                Connexion
              </Link>
            </li>
            <li>
              <Link
                href="/inscription"
                className="transition-colors duration-300 hover:text-orange-400"
              >
                Créer un compte
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 font-space text-lg font-bold text-orange-400">Corridor</h4>
          <div className="flex flex-wrap gap-1.5">
            {CORRIDOR_CITIES.slice(0, 8).map((city) => (
              <span
                key={city.name}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70"
              >
                {city.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60">
          © {new Date().getFullYear()} Livre-moi.ca. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
