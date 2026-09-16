import { cn } from "@/lib/utils";

export const heroSubtitleClassName = "uber-home-lead";

export function HeroSubtitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn(heroSubtitleClassName, className)}>{children}</p>;
}
