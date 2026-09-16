import {
  Banknote,
  Bell,
  Check,
  MessageCircle,
  Package,
  type LucideIcon,
} from "lucide-react";
import type { AppNotification } from "@/lib/types";

export const NOTIFICATION_KIND_FILTERS = [
  { key: "all", label: "Tous les types" },
  { key: "tarif", label: "Tarif" },
  { key: "message", label: "Message" },
  { key: "suivi", label: "Suivi" },
  { key: "accepte", label: "Accepté" },
  { key: "colis", label: "Colis" },
] as const;

export type NotificationKind = Exclude<
  (typeof NOTIFICATION_KIND_FILTERS)[number]["key"],
  "all"
>;

export function notificationKind(item: AppNotification): {
  key: NotificationKind;
  label: string;
  icon: LucideIcon;
} {
  if (
    item.type === "PARCEL_OFFER_ACCEPTED" ||
    item.title === "Tarif accepté" ||
    item.title === "Proposition retenue"
  ) {
    return { key: "accepte", label: "Accepté", icon: Check };
  }
  if (item.type === "PARCEL_OFFER_DECLINED" || item.title === "Colis attribué") {
    return { key: "colis", label: "Colis", icon: Package };
  }
  if (
    item.type === "PARCEL_PRICE_COUNTER" ||
    item.title === "Nouveau tarif" ||
    item.title === "Contre-proposition" ||
    item.title === "Prix mis à jour"
  ) {
    return { key: "tarif", label: "Tarif", icon: Banknote };
  }
  if (item.title === "Proposition de transport") {
    return { key: "message", label: "Message", icon: MessageCircle };
  }
  return { key: "suivi", label: "Suivi", icon: Bell };
}

export function notificationMatchesQuery(item: AppNotification, query: string) {
  const needle = query.trim().toLocaleLowerCase("fr-CA");
  if (!needle) return true;
  const kind = notificationKind(item);
  return [item.title, item.body, kind.label].some((value) =>
    value.toLocaleLowerCase("fr-CA").includes(needle),
  );
}
