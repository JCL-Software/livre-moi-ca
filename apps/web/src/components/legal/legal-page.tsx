import Link from "next/link";
import { LEGAL_LINKS } from "@/components/legal/legal-links";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="section-plain">
      <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <p className="uber-home-kicker">Confiance et informations légales</p>
        <h1 className="uber-home-title mt-3">{title}</h1>
        <p className="uber-home-lead mt-3">Dernière mise à jour : {updated}</p>

        <div className="uber-section-lead mt-10 space-y-8">{children}</div>

        <nav
          aria-label="Autres pages légales"
          className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E2E2E2] pt-6 text-sm"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-[#545454] underline-offset-4 hover:text-black hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="uber-card-title">{title}</h2>
      {children}
    </section>
  );
}
