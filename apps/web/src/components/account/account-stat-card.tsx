import Link from "next/link";
import { UberCard } from "@/components/baseweb/uber-ui";

export function AccountStatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const inner = (
    <UberCard>
      <p className="uber-home-kicker">{label}</p>
      <p className="uber-price mt-2">{value}</p>
    </UberCard>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="block no-underline hover:opacity-90">
      {inner}
    </Link>
  );
}
