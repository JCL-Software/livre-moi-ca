import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  AccountPriceBlock,
  AccountStatusPill,
} from "@/components/account/account-ui";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { formatDateTime } from "@/lib/account-format";
import type { ConversationPreview } from "@/lib/types";

export function AccountConversationCard({ item }: { item: ConversationPreview }) {
  const chosen = item.matched_conversation_id === item.id;
  const listingMatched = item.listing_status === "MATCHED";
  const status = chosen
    ? { tone: "solid" as const, label: "Retenu" }
    : listingMatched
      ? { tone: "muted" as const, label: "Non retenu" }
      : { tone: "soft" as const, label: "En discussion" };

  return (
    <li>
      <Link href={`/compte/messages/${item.id}`} className="block no-underline">
        <UberCard>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <UberAvatar
              name={item.counterpart_name}
              src={item.counterpart_avatar_url}
              size="40px"
              verified={item.counterpart_verified}
            />
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="uber-card-title">
                  {item.listing_title ?? "Conversation"}
                </p>
                <AccountStatusPill tone={status.tone}>{status.label}</AccountStatusPill>
              </div>
              {item.listing_route ? (
                <p className="text-sm font-medium text-[#545454]">
                  {item.listing_route}
                </p>
              ) : null}
              <p className="text-sm text-neutral-500">Avec {item.counterpart_name}</p>
              {item.last_message ? (
                <p className="line-clamp-1 text-sm text-neutral-500">{item.last_message}</p>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-3">
            <AccountPriceBlock
              amount={item.proposed_price}
              label={chosen ? "Prix convenu" : "Tarif"}
            />
            <p className="flex items-center gap-1 text-xs text-neutral-400">
              {formatDateTime(item.last_message_at ?? item.created_at)}
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </p>
          </div>
        </div>
        </UberCard>
      </Link>
    </li>
  );
}
