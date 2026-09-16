import {
  AccountIconTile,
  AccountStatusPill,
} from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";
import { notificationKind } from "@/components/account/notification-kind";
import { formatDateTime } from "@/lib/account-format";
import { openNotification } from "@/lib/actions/messaging";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

export function AccountNotificationCard({ item }: { item: AppNotification }) {
  const unread = item.read_at == null;
  const visual = notificationKind(item);
  const Icon = visual.icon;

  return (
    <li>
      <form action={openNotification.bind(null, item.id, item.link ?? "/compte")}>
        <button type="submit" className="w-full p-0 text-left">
          <UberCard className={cn(unread && "ring-1 ring-black")}>
          <div className="flex items-start gap-3">
            <AccountIconTile>
              <Icon className="h-5 w-5" aria-hidden />
            </AccountIconTile>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="uber-card-title">
                  {item.title}
                </p>
                {unread ? (
                  <AccountStatusPill tone="solid">Nouveau</AccountStatusPill>
                ) : (
                  <AccountStatusPill tone="muted">{visual.label}</AccountStatusPill>
                )}
              </div>
              <p className="mt-1 mb-0 text-sm leading-relaxed text-[#545454]">
                {item.body}
              </p>
              <p className="mt-2 text-xs text-[#545454]">
                {formatDateTime(item.created_at)}
              </p>
            </div>
          </div>
          </UberCard>
        </button>
      </form>
    </li>
  );
}
