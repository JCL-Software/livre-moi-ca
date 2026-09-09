import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-6">
          <BrandLogo variant="light" />
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Des personnes et des colis qui avancent ensemble au Québec et en Ontario.
          </p>
          <p className="text-sm text-white/50">
            Couverture Québec · Ontario
          </p>
        </div>

        <div>
          <h4 className="mb-6 text-base font-bold">Navigation</h4>
          <ul className="space-y-3 text-white/70">
            <li>
              <Link href="/recherche" className="transition-colors hover:text-white">
                Rechercher
              </Link>
            </li>
            <li>
              <Link
                href="/trajets/nouveau"
                className="transition-colors hover:text-white"
              >
                Publier un trajet
              </Link>
            </li>
            <li>
              <Link href="/connexion" className="transition-colors hover:text-white">
                Connexion
              </Link>
            </li>
            <li>
              <Link
                href="/inscription"
                className="transition-colors hover:text-white"
              >
                S&apos;inscrire
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-base font-bold">Territoire</h4>
          <p className="text-sm leading-relaxed text-white/70">
            De ville en ville, au Québec et en Ontario. Trouvez un trajet qui
            correspond à votre réalité.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/50">
          © {new Date().getFullYear()} Livre-moi.ca. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
