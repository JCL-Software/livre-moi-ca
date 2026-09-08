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
  title,
  subtitle,
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
      <h2 className="text-[clamp(1.45rem,0.95rem+2.2vw,2.5rem)] font-semibold leading-tight tracking-tight text-black text-balance dark:text-white">
        {title}
      </h2>
      <div
        className={cn(
          "mt-5 h-px w-16 bg-black",
          align === "center" && "mx-auto",
        )}
      />
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-[#5E5E5E] md:text-lg dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
