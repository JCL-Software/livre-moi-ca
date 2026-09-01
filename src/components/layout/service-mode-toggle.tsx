"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const modes = [
  { id: "colis" as const, href: "/", label: "Colis", icon: Package },
  { id: "covoiturage" as const, href: "/covoiturage", label: "Covoiturage", icon: Car },
];

export function ServiceModeToggle({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "header";
  className?: string;
}) {
  const pathname = usePathname();
  const isCovoiturage = pathname.startsWith("/covoiturage");

  return (
    <div
      className={cn(
        "inline-flex rounded-xl p-1 ring-1 backdrop-blur-sm",
        variant === "hero"
          ? "bg-white/10 ring-white/15"
          : "bg-slate-100 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700",
        className,
      )}
      role="tablist"
      aria-label="Type de service"
    >
      {modes.map(({ id, href, label, icon: Icon }) => {
        const active = id === "covoiturage" ? isCovoiturage : !isCovoiturage;
        return (
          <Link
            key={id}
            href={href}
            role="tab"
            aria-selected={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition-all duration-200 sm:px-5 sm:text-base",
              variant === "hero"
                ? active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-orange-100 hover:bg-white/10 hover:text-white"
                : active
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                  : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
