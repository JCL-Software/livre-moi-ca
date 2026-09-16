"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountNotificationCard } from "@/components/account/account-notification-card";
import { ACCOUNT_FIELD } from "@/components/account/account-ui";
import {
  NOTIFICATION_KIND_FILTERS,
  notificationKind,
  notificationMatchesQuery,
  type NotificationKind,
} from "@/components/account/notification-kind";
import type { AppNotification } from "@/lib/types";

export function AccountNotificationsList({ items }: { items: AppNotification[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | NotificationKind>("all");

  const availableKinds = useMemo(() => {
    const present = new Set(items.map((item) => notificationKind(item).key));
    return NOTIFICATION_KIND_FILTERS.filter(
      (option) => option.key === "all" || present.has(option.key),
    );
  }, [items]);

  const visible = useMemo(() => {
    return items.filter((item) => {
      if (kind !== "all" && notificationKind(item).key !== kind) return false;
      return notificationMatchesQuery(item, query);
    });
  }, [items, kind, query]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Rechercher dans les notifications</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une notification…"
            className={`${ACCOUNT_FIELD} h-14 pl-10`}
          />
        </label>
        <label className="sm:w-48">
          <span className="sr-only">Filtrer par type</span>
          <select
            value={kind}
            onChange={(event) =>
              setKind(event.target.value as "all" | NotificationKind)
            }
            className={`${ACCOUNT_FIELD} h-14 appearance-none bg-[length:12px_8px] bg-[right_0.9rem_center] bg-no-repeat pr-9`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            }}
          >
            {availableKinds.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <AccountEmpty
          title="Aucun résultat"
          description="Aucune notification ne correspond à cette recherche ou à ce type."
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <AccountNotificationCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
