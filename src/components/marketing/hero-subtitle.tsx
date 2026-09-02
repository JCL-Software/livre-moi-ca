import { cn } from "@/lib/utils";

export const heroSubtitleClassName =
  "max-w-xl text-base font-semibold leading-7 text-orange-100 sm:text-lg";

export function HeroSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn(heroSubtitleClassName, className)}>{children}</p>;
}
