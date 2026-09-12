import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Articles interdits",
  description: `Objets et matières que ${APP_NAME} n'accepte pas dans un colis partagé.`,
};

export default function ArticlesInterditsPage() {
  return (
    <LegalPage title="Articles interdits" updated="9 septembre 2026">
      <p>
        Un colis transporté via {APP_NAME} doit être légal, sécuritaire,
        correctement emballé et compatible avec l&apos;espace annoncé. Le
        conducteur n&apos;est pas un transporteur professionnel : certains
        envois n&apos;ont pas leur place dans un véhicule personnel.
      </p>

      <LegalSection title="Interdits">
        <ul className="list-disc space-y-2 pl-5">
          <li>Armes, munitions et répliques d&apos;armes</li>
          <li>Matières dangereuses, inflammables, explosives ou toxiques</li>
          <li>Drogues, tabac de contrebande et tout produit illégal</li>
          <li>Argent comptant, titres négociables et métaux précieux en quantité</li>
          <li>Animaux vivants, sauf accord explicite et conditions prévues pour un covoiturage</li>
          <li>Denrées périssables qui ne peuvent pas voyager de façon sûre</li>
          <li>Articles mal emballés, qui fuient ou qui peuvent endommager le véhicule</li>
          <li>Objets dont le transport est interdit par la loi canadienne, québécoise ou ontarienne</li>
        </ul>
      </LegalSection>

      <LegalSection title="Acceptés avec prudence">
        <p>
          Documents, vêtements, achats entre particuliers, pièces, outils et
          objets du quotidien peuvent circuler s&apos;ils tiennent dans le
          format choisi. En cas de doute, prenez le format supérieur, ajoutez
          une photo et décrivez le contenu au conducteur avant la remise.
        </p>
      </LegalSection>

      <LegalSection title="Refus">
        <p>
          Le conducteur peut refuser un colis à la rencontre s&apos;il ne
          correspond pas à l&apos;annonce. L&apos;expéditeur reste responsable
          du contenu. Un envoi interdit peut entraîner l&apos;annulation de la
          réservation et la suspension du compte.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
