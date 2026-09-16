import type { Metadata } from "next";
import { SafetyPage } from "@/components/marketing/safety-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sécurité",
  description: `Comment ${APP_NAME} protège les passagers, les conducteurs et les envois de colis : vérification, partage de trajet, messagerie et paiement sécurisé.`,
};

export default function SecuritePage() {
  return <SafetyPage />;
}
