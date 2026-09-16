import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: `Conditions d'utilisation de ${APP_NAME} pour le covoiturage et le cotransportage de colis au Québec et en Ontario.`,
};

export default function ConditionsPage() {
  return (
    <LegalPage title="Conditions d'utilisation" updated="9 septembre 2026">
      <LegalSection title="Objet du service">
        <p>
          {APP_NAME} met en relation des personnes qui se déplacent déjà entre des
          villes du Québec et de l&apos;Ontario avec des passagers ou des
          expéditeurs de colis. La plateforme n&apos;est pas un transporteur, un
          taxi ni un service de messagerie professionnelle. Chaque trajet reste
          celui du conducteur.
        </p>
      </LegalSection>

      <LegalSection title="Compte">
        <p>
          Vous devez fournir des informations exactes, avoir l&apos;âge légal
          requis et garder vos identifiants confidentiels. Un conducteur qui
          propose des places ou transporte un colis doit compléter les
          vérifications demandées avant d&apos;accueillir un passager ou un colis.
        </p>
      </LegalSection>

      <LegalSection title="Réservations">
        <p>
          Une réservation est un accord entre les utilisateurs, facilité par la
          plateforme. Le paiement est encaissé par{" "}
          {APP_NAME} selon les montants affichés au moment de la confirmation. Il
          n&apos;y a pas d&apos;échange d&apos;argent comptant entre les parties
          pour une réservation faite sur le site.
        </p>
      </LegalSection>

      <LegalSection title="Colis">
        <p>
          L&apos;expéditeur est responsable du contenu, de l&apos;emballage et
          de la légalité de l&apos;envoi. Les articles interdits sont décrits
          sur la page dédiée. Le conducteur peut refuser un colis qui ne
          correspond pas à l&apos;annonce, qui est mal emballé ou qui présente
          un risque.
        </p>
      </LegalSection>

      <LegalSection title="Annulation et litiges">
        <p>
          Les délais d&apos;annulation affichés au moment de la réservation
          s&apos;appliquent. En cas de problème, utilisez d&apos;abord la
          messagerie liée au trajet, puis le support. {APP_NAME} peut
          examiner les preuves (photos, code de confirmation, historique) pour
          statuer sur un remboursement ou une retenue.
        </p>
      </LegalSection>

      <LegalSection title="Limitation">
        <p>
          {APP_NAME} ne garantit pas l&apos;absence de tout incident sur la
          route. Les vérifications de profil réduisent certains risques, elles
          ne les éliminent pas. Ces conditions pourront être précisées avant
          l&apos;ouverture commerciale complète du service.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
