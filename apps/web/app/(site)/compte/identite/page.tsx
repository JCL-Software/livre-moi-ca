import { AccountPageHeader } from "@/components/account/account-page-header";
import { IdentityDocuments } from "@/components/account/identity-documents";
import { UberCard } from "@/components/baseweb/uber-ui";
import { requireAccount } from "@/lib/account";

export default async function AccountIdentityPage() {
  const { supabase, user, profile } = await requireAccount();
  const verified = Boolean(profile?.identity_verified);
  const { data: files } = await supabase.storage.from("licenses").list(user.id, {
    limit: 20,
    sortBy: { column: "created_at", order: "desc" },
  });

  const documents = (files ?? []).filter(
    (file) => file.name && file.name !== ".emptyFolderPlaceholder",
  );

  return (
    <div>
      <AccountPageHeader
        title="Vérification d’identité"
        description="Requise pour proposer un transport de colis, en plus de l’option « Accepter des colis »."
      />

      <UberCard className="mb-4">
        <p className="m-0 text-sm font-medium text-black">Statut</p>
        <p className="mt-1 mb-0 text-sm text-[#545454]">
          {verified
            ? "Identité vérifiée. Vous pouvez proposer un transport si « Accepter des colis » est activé."
            : documents.length > 0
              ? "Document reçu. La validation est effectuée par l’équipe — elle n’est pas automatique."
              : "Aucun document validé pour le moment."}
        </p>
      </UberCard>

      <IdentityDocuments verified={verified} files={documents} />
    </div>
  );
}
