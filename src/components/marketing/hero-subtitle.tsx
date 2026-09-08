import { cn } from "@/lib/utils";

export const heroSubtitleClassName =
  "max-w-xl text-base font-normal leading-7 text-neutral-600 sm:text-lg dark:text-neutral-400";

export function HeroSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn(heroSubtitleClassName, className)}>{children}</p>;
}
