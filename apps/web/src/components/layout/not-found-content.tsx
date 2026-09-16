import Link from "next/link";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { UberCard } from "@/components/baseweb/uber-ui";
import { SitePage } from "@/components/layout/site-page";

export function NotFoundContent() {
  return (
    <SitePage>
      <div className="mx-auto max-w-md space-y-6">
        <UberPageIntro kicker="Erreur 404" title="Page introuvable" />
        <UberCard>
          <p className="m-0 text-sm leading-relaxed text-[#545454]">
            Cette page n&apos;existe pas ou a été retirée. Revenez à l&apos;accueil
            pour chercher un départ ou publier un colis.
          </p>
          <Link href="/" className="btn-brand mt-5 h-14 w-full">
            Retour à l&apos;accueil
          </Link>
        </UberCard>
      </div>
    </SitePage>
  );
}
