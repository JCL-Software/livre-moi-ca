import { redirect } from "next/navigation";
import { ACCOUNT_CARPOOL_TABS } from "@/lib/account-covoiturage";

export default function AccountVoyagesRedirectPage() {
  redirect(ACCOUNT_CARPOOL_TABS.voyages.href);
}
