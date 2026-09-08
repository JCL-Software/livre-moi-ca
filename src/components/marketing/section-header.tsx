import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  inlineBadge?: boolean;
  className?: string;
};

export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
  inlineBadge = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 w-full max-w-6xl",
        inlineBadge && "max-w-4xl",
        align === "center" && "text-center md:mx-auto",
        className,
      )}
    >
      {badge && inlineBadge ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            align === "center" && "justify-center",
          )}
        >
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
            {badge}
          </p>
          <h2 className="font-space text-[clamp(1.15rem,0.7rem+1.8vw,2.1rem)] font-extrabold tracking-tight text-slate-950 whitespace-nowrap dark:text-white max-md:whitespace-normal max-md:leading-tight">
            {title}
          </h2>
        </div>
      ) : (
        <>
          {badge && (
            <p className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-extrabold text-orange-700 dark:bg-orange-950/60 dark:text-orange-300">
              {badge}
            </p>
          )}
          <h2
            className={cn(
              "font-space text-[clamp(1.2rem,0.75rem+2.1vw,2.2rem)] font-extrabold tracking-tight text-slate-950 whitespace-nowrap dark:text-white max-md:whitespace-normal max-md:leading-tight",
              badge && "mt-5",
            )}
          >
            {title}
          </h2>
        </>
      )}
      <div
        className={cn(
          "mt-5 h-1 w-20 rounded-full bg-orange-500",
          align === "center" && "mx-auto",
        )}
      />
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
