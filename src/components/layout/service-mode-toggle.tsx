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
  const iconOnly = variant === "header";

  return (
    <div
      className={cn(
        "inline-flex shrink-0 rounded-full p-1 ring-1",
        variant === "hero"
          ? "bg-[#F3F3F3] ring-black/10 dark:bg-white/8 dark:ring-white/15"
          : "bg-white/10 ring-white/20",
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
            aria-label={label}
            title={label}
            className={cn(
              "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200",
              iconOnly
                ? "h-9 w-9"
                : "gap-2 px-4 py-2 text-sm sm:px-5 sm:text-base",
              variant === "hero"
                ? active
                  ? "bg-black text-white"
                  : "text-[#5E5E5E] hover:bg-white hover:text-black dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
                : active
                  ? "bg-white text-black"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!iconOnly && label}
          </Link>
        );
      })}
    </div>
  );
}
