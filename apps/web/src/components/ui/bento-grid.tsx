"use client";

import { cn } from "@/lib/utils";
import { UberIconTile } from "@/components/baseweb/uber-ui";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <article
      className={cn(
        "feature-card group/bento relative z-10 flex h-full flex-col gap-4 overflow-visible rounded-lg border border-neutral-200 bg-card p-6 shadow-sm before:hidden hover:z-20 dark:border-white/10 dark:bg-card",
        className,
      )}
    >
      <div>
        {icon ? <UberIconTile>{icon}</UberIconTile> : null}
        <h3 className="m-0 mt-3 text-[15px] font-semibold leading-snug text-black">{title}</h3>
        <div className="mt-1.5 text-[13px] leading-5 text-[#545454]">{description}</div>
      </div>
    </article>
  );
};
