import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  subtitle?: ReactNode;
  subtitleClassName?: string;
  align?: "left" | "center";
  inlineBadge?: boolean;
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  subtitleClassName,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 w-full",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2 className="uber-section-title">{title}</h2>
      {subtitle ? (
        <p
          className={cn(
            "uber-section-lead mt-3",
            subtitleClassName ??
              (align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"),
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
