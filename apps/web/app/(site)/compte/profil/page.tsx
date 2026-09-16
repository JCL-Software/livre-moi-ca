import { AccountPageHeader } from "@/components/account/account-page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireAccount, toProfileFormValues } from "@/lib/account";

export default async function AccountProfilePage() {
  const { user, profile } = await requireAccount();

  return (
    <div>
      <AccountPageHeader
        title="Profil"
        description="Nom, téléphone, bio et photo visibles par la communauté."
      />
      <ProfileForm
        email={user.email ?? ""}
        mode="identity"
        profile={toProfileFormValues(profile)}
      />
    </div>
  );
}
