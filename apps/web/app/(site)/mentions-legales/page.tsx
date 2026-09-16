import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: `Éditeur, hébergement et informations légales de ${APP_NAME}.`,
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="9 septembre 2026">
      <LegalSection title="Éditeur">
        <p>
          Le site {APP_NAME} est édité pour offrir une mise en relation entre
          conducteurs, passagers et expéditeurs de colis au Québec et en
          Ontario. Le service est en cours de déploiement : certaines fonctions
          (application mobile, support) seront activées progressivement.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement">
        <p>
          Le site public est servi via une infrastructure infonuagique. Les
          données applicatives (comptes, trajets, messages) sont hébergées par
          le fournisseur de base de données utilisé par {APP_NAME}.
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les textes, marques, logos et visuels de {APP_NAME} sont protégés.
          Toute reproduction non autorisée est interdite. Les marques de
          tiers éventuellement citées restent la propriété de leurs titulaires.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Pour une question légale ou une demande relative à vos données,
          utilisez votre compte {APP_NAME} ou les coordonnées qui seront
          publiées lorsque le centre d&apos;aide sera ouvert.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
