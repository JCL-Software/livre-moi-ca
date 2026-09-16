import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { UberAvatar, UberCard, UberTag } from "@/components/baseweb/uber-ui";
import { SiteBackLink } from "@/components/layout/site-page";
import { cn } from "@/lib/utils";
import { PARCEL_LISTING_STATUS_LABELS } from "@/lib/constants";

export function ConversationHeader({
  title,
  route,
  listingHref,
  listingStatus,
  counterpartName,
  counterpartAvatarUrl,
  counterpartVerified,
  counterpartProfileHref,
  messagesHref,
  tarifHref,
  tarifTab,
  showTarifNav,
  listingOpen,
}: {
  title: string;
  route: string | null;
  listingHref: string | null;
  listingStatus: string | null;
  counterpartName: string | null;
  counterpartAvatarUrl?: string | null;
  counterpartVerified?: boolean;
  counterpartProfileHref?: string | null;
  messagesHref: string;
  tarifHref: string;
  tarifTab: boolean;
  showTarifNav: boolean;
  listingOpen: boolean;
}) {
  const statusLabel = listingStatus
    ? (PARCEL_LISTING_STATUS_LABELS[listingStatus] ?? listingStatus)
    : null;

  return (
    <UberCard>
      <SiteBackLink href="/compte/messages">Toutes les conversations</SiteBackLink>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="uber-section-title">
              {title}
            </h1>
            {statusLabel ? <UberTag>{statusLabel}</UberTag> : null}
          </div>
          {route ? (
            <p className="m-0 text-sm text-[#545454]">{route}</p>
          ) : null}
          {counterpartName ? (
            <div className="flex items-center gap-2">
              {counterpartProfileHref ? (
                <Link
                  href={counterpartProfileHref}
                  className="inline-flex shrink-0 no-underline"
                  title={`Voir le profil de ${counterpartName}`}
                >
                  <UberAvatar
                    name={counterpartName}
                    src={counterpartAvatarUrl}
                    size="32px"
                    verified={Boolean(counterpartVerified)}
                  />
                </Link>
              ) : (
                <UberAvatar
                  name={counterpartName}
                  src={counterpartAvatarUrl}
                  size="32px"
                  verified={Boolean(counterpartVerified)}
                />
              )}
              <p className="m-0 text-sm text-[#545454]">Avec {counterpartName}</p>
            </div>
          ) : null}
        </div>
        {listingHref ? (
          <Link
            href={listingHref}
            className="btn-brand-secondary h-10 shrink-0 gap-1.5 px-4 py-0 text-sm"
          >
            Voir l&apos;annonce
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : null}
      </div>

      {showTarifNav ? (
        <div
          role="tablist"
          aria-label="Conversation"
          className="mt-5 inline-flex rounded-full bg-[#EEEEEE] p-1"
        >
          <Link
            href={messagesHref}
            role="tab"
            aria-selected={!tarifTab}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold no-underline transition-colors",
              !tarifTab ? "bg-black text-white" : "text-[#545454] hover:bg-white hover:text-black",
            )}
          >
            Messages
          </Link>
          <Link
            href={tarifHref}
            role="tab"
            aria-selected={tarifTab}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold no-underline transition-colors",
              tarifTab ? "bg-black text-white" : "text-[#545454] hover:bg-white hover:text-black",
            )}
          >
            {listingOpen ? "Proposer un tarif" : "Tarif"}
          </Link>
        </div>
      ) : null}
    </UberCard>
  );
}
