import Link from "next/link";
import { AccountConversationCard } from "@/components/account/account-conversation-card";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { requireAccount } from "@/lib/account";
import { listUserConversations } from "@livre-moi/shared/data";

export default async function AccountMessagesPage() {
  const { supabase, user } = await requireAccount();
  const result = await listUserConversations(supabase, user.id);
  const conversations = result.ok ? result.data : [];

  return (
    <div>
      <AccountPageHeader
        title="Messages"
        description="Échanges autour des propositions de transport de colis."
      />

      {conversations.length === 0 ? (
        <AccountEmpty
          title="Aucune conversation"
          description="Quand quelqu’un propose de transporter votre colis — ou que vous en acceptez un — la discussion apparaît ici."
          action={
            <Link href="/colis" className="btn-brand-secondary text-sm">
              Voir les colis disponibles
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {conversations.map((item) => (
            <AccountConversationCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
