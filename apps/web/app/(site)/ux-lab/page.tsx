import Link from "next/link";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { UX_SKINS } from "@/lib/ux-lab/skins";

export default function UxLabPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <AccountPageHeader
        title="Laboratoire UX"
        description="Worktree isolé. Cette itération utilise Base Web, le design system d’Uber."
      />

      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Refonte en cours</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Accueil type Uber (carte + « d’où / vers où »), header Base Web, boutons et
            cartes du design system. Les cartes Mapbox restent celles du projet.
          </p>
          <p className="mt-2 text-sm">
            Docs :{" "}
            <a
              href="https://baseweb.design/"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              baseweb.design
            </a>
          </p>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Skins</h2>
          <ul className="mt-4 space-y-3">
            {UX_SKINS.map((skin) => (
              <li key={skin.id} className="flex gap-3">
                <span
                  className="mt-1 h-4 w-4 shrink-0 rounded-full"
                  style={{ background: skin.swatch }}
                />
                <div>
                  <p className="font-medium">{skin.label}</p>
                  <p className="text-sm text-muted-foreground">{skin.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Link href="/" className="text-sm underline underline-offset-2">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
