import Link from "next/link";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { ProfileForm } from "@/components/profile/profile-form";
import { requireAccount, toProfileFormValues } from "@/lib/account";

export default async function AccountVehiclePage() {
  const { user, profile } = await requireAccount();

  return (
    <div>
      <AccountPageHeader
        title="Véhicule et colis"
        description="Indiquez si vous conduisez, votre véhicule, et si vous acceptez des colis."
      />
      <ProfileForm
        email={user.email ?? ""}
        mode="vehicle"
        profile={toProfileFormValues(profile)}
      />
      <p className="mt-4 text-sm text-[#545454]">
        Pour proposer un transport de colis, l&apos;identité doit aussi être vérifiée.{" "}
        <Link
          href="/compte/identite"
          className="font-medium text-black underline-offset-4 hover:underline"
        >
          Gérer la vérification
        </Link>
      </p>
    </div>
  );
}
