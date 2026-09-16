import Link from "next/link";
import type { ReactNode } from "react";
import {
  ACCOUNT_PARCELS_TABS,
  type AccountParcelTab,
} from "@/lib/account-parcels";
import { cn } from "@/lib/utils";

export function AccountParcelsTabs({
  tab,
  publishedCount,
  transportCount,
  published,
  transport,
}: {
  tab: AccountParcelTab;
  publishedCount: number;
  transportCount: number;
  published: ReactNode;
  transport: ReactNode;
}) {
  const counts = {
    annonces: publishedCount,
    transporter: transportCount,
  } as const;
  const active = ACCOUNT_PARCELS_TABS[tab];

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Catégories de colis"
        className="flex flex-wrap gap-1 border-b border-[#EEEEEE]"
      >
        {[ACCOUNT_PARCELS_TABS.annonces, ACCOUNT_PARCELS_TABS.transporter].map((item) => {
          const selected = item.id === tab;
          return (
            <Link
              key={item.id}
              href={item.href}
              scroll={false}
              role="tab"
              aria-selected={selected}
              className={cn(
                "-mb-px inline-flex items-center gap-2 border-b-2 px-3 pb-3 text-[15px] font-semibold no-underline transition-colors",
                selected
                  ? "border-black text-black"
                  : "border-transparent text-[#545454] hover:text-black",
              )}
            >
              {item.tabLabel}
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  selected ? "bg-black text-white" : "bg-[#EEEEEE] text-[#545454]",
                )}
              >
                {counts[item.id]}
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-4 mb-4 text-[13px] leading-5 text-[#545454]">{active.description}</p>

      <div role="tabpanel" aria-label={active.tabLabel}>
        {tab === "annonces" ? published : transport}
      </div>
    </div>
  );
}
