import Link from "next/link";
import { UberIconTile, UberTag } from "@/components/baseweb/uber-ui";
import { formatPrixCad } from "@livre-moi/shared/pricing";

export const ACCOUNT_FIELD =
  "h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 text-base font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black";

export const ACCOUNT_AREA =
  "min-h-28 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 py-3 text-base font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black";

export function AccountFieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="uber-home-kicker mb-1.5 block">
      {children}
    </label>
  );
}

export function memberProfileHref(memberId: string) {
  return `/membres/${memberId}`;
}

export function AccountStatusPill({
  children,
  tone,
  href,
}: {
  children: React.ReactNode;
  tone: "solid" | "soft" | "muted" | "success";
  href?: string | null;
}) {
  const tag = <UberTag tone={tone}>{children}</UberTag>;
  if (!href) return tag;
  return (
    <Link
      href={href}
      className="inline-flex no-underline hover:opacity-80"
      title="Voir le profil"
    >
      {tag}
    </Link>
  );
}

export function AccountIconTile({ children }: { children: React.ReactNode }) {
  return <UberIconTile>{children}</UberIconTile>;
}

export function AccountPriceBlock({
  amount,
  label,
}: {
  amount: number | null | undefined;
  label: string;
}) {
  if (amount == null) return null;
  return (
    <div className="shrink-0 text-right">
      <p className="uber-price">
        {formatPrixCad(amount)}
      </p>
      <p className="mt-0.5 mb-0 text-xs text-[#545454]">{label}</p>
    </div>
  );
}

export function accountInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
