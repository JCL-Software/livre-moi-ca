import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  showWordmark?: boolean;
  variant?: "light" | "dark";
};

export function BrandLogo({
  className,
  priority = false,
  showWordmark = true,
  variant = "dark",
}: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn("group flex shrink-0 items-center gap-2", className)}
      aria-label={APP_NAME}
    >
      <Image
        src="/brand/logo-pin.webp"
        alt=""
        width={36}
        height={36}
        priority={priority}
        className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-105"
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display text-[20px] font-medium leading-7",
            isLight ? "text-white" : "text-black dark:text-white",
          )}
        >
          Livre-moi.ca
        </span>
      )}
    </Link>
  );
}
