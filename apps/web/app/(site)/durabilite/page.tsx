import type { Metadata } from "next";
import { DurabilityPage } from "@/components/marketing/durability-page";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Durabilité",
  description: `Comment ${APP_NAME} réduit les trajets inutiles en partageant des sièges et des coffres déjà en route entre le Québec et l’Ontario.`,
};

export default function DurabilitePage() {
  return <DurabilityPage />;
}
