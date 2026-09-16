import { AccountPageHeader } from "@/components/account/account-page-header";
import { SecurityForms } from "@/components/account/security-forms";
import { requireAccount } from "@/lib/account";

export default async function AccountSecurityPage() {
  const { user } = await requireAccount();

  return (
    <div>
      <AccountPageHeader
        title="Sécurité"
        description="Courriel, mot de passe et session de cet appareil."
      />
      <SecurityForms email={user.email ?? ""} />
    </div>
  );
}
