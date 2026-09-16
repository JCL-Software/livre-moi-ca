import type { ReactNode } from "react";
import { AccountIconTile } from "@/components/account/account-ui";
import { UberCard, UberTag } from "@/components/baseweb/uber-ui";

export function AccountCategory({
  icon,
  title,
  description,
  count,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <UberCard as="section" padded={false}>
      <header className="flex items-start justify-between gap-4 border-b border-[#EEEEEE] px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <AccountIconTile>{icon}</AccountIconTile>
          <div className="min-w-0">
            <h2 className="m-0 text-[15px] font-semibold leading-snug text-black">{title}</h2>
            <p className="mt-0.5 mb-0 text-[13px] leading-5 text-[#545454]">{description}</p>
          </div>
        </div>
        <UberTag tone="soft">{count}</UberTag>
      </header>
      <div className="px-5 py-4">{children}</div>
    </UberCard>
  );
}

export function AccountCategoryEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-[#F6F6F6] px-4 py-6 text-center">
      <p className="m-0 font-medium text-black">{title}</p>
      <p className="mt-1 mb-0 text-sm text-[#545454]">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
