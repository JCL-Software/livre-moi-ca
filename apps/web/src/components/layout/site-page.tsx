import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function SitePage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="section-muted">
      <div className={cn("mx-auto max-w-7xl px-4 py-8 md:py-10", className)}>
        {children}
      </div>
    </section>
  );
}

export function SiteBackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium text-[#545454] no-underline transition-colors hover:bg-[#EEEEEE] hover:text-black"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      {children}
    </Link>
  );
}
