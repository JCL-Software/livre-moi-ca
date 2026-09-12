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
        <p className="text-sm font-medium text-neutral-500">Confiance et informations légales</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl dark:text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm text-neutral-500">Dernière mise à jour : {updated}</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          {children}
        </div>

        <nav
          aria-label="Autres pages légales"
          className="mt-14 flex flex-wrap gap-x-5 gap-y-2 border-t border-neutral-200 pt-6 text-sm dark:border-white/10"
        >
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-neutral-600 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-white"
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
      <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}
