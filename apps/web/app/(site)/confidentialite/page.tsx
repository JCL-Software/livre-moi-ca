import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment ${APP_NAME} collecte et utilise vos renseignements personnels.`,
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="9 septembre 2026">
      <LegalSection title="Renseignements collectés">
        <p>
          Nous collectons les informations nécessaires au service : identité du
          compte, courriel, numéro de téléphone, profil, véhicule, trajets,
          réservations, messages liés à un trajet, photos de colis et, lorsque
          le suivi est activé, des points de localisation pendant une livraison.
        </p>
      </LegalSection>

      <LegalSection title="Utilisation">
        <p>
          Ces données servent à créer votre compte, afficher les annonces,
          confirmer une remise (code ou photo), prévenir la fraude, améliorer le
          service et, si vous êtes conducteur, à vérifier votre profil. Nous ne
          vendons pas vos renseignements personnels.
        </p>
      </LegalSection>

      <LegalSection title="Partage">
        <p>
          Les annonces de colis et les trajets publiés sont visibles par tous
          les utilisateurs. Les informations utiles à une rencontre (prénom,
          photo, véhicule, statut de la réservation) sont partagées avec les
          personnes concernées par un trajet ou une livraison confirmée. Les
          fournisseurs techniques (hébergement, authentification, paiements)
          n&apos;y ont accès que pour opérer le service. Les autorités peuvent
          en recevoir si la loi l&apos;exige.
        </p>
      </LegalSection>

      <LegalSection title="Conservation et vos droits">
        <p>
          Nous conservons les données le temps nécessaire aux réservations, aux
          litiges et aux obligations légales. Au Québec, vous pouvez demander
          l&apos;accès, la rectification ou la suppression de vos
          renseignements, sous réserve des durées de conservation obligatoires.
          Les demandes se font via votre compte ou le support.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
