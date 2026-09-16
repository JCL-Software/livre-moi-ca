import Link from "next/link";
import type { ReactNode } from "react";
import {
  ACCOUNT_CARPOOL_TABS,
  type AccountCarpoolTab,
} from "@/lib/account-covoiturage";
import { UberTag } from "@/components/baseweb/uber-ui";
import { cn } from "@/lib/utils";

export function AccountCarpoolTabs({
  tab,
  voyagesCount,
  trajetsCount,
  voyages,
  trajets,
}: {
  tab: AccountCarpoolTab;
  voyagesCount: number;
  trajetsCount: number;
  voyages: ReactNode;
  trajets: ReactNode;
}) {
  const counts = {
    voyages: voyagesCount,
    trajets: trajetsCount,
  } as const;
  const active = ACCOUNT_CARPOOL_TABS[tab];

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="Catégories covoiturage"
        className="flex flex-wrap gap-1 border-b border-[#EEEEEE]"
      >
        {[ACCOUNT_CARPOOL_TABS.voyages, ACCOUNT_CARPOOL_TABS.trajets].map((item) => {
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
              <UberTag tone={selected ? "solid" : "soft"}>{counts[item.id]}</UberTag>
            </Link>
          );
        })}
      </div>

      <p className="mt-4 mb-4 text-[13px] leading-5 text-[#545454]">{active.description}</p>

      <div role="tabpanel" aria-label={active.tabLabel}>
        {tab === "voyages" ? voyages : trajets}
      </div>
    </div>
  );
}
