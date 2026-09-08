import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type HowItWorksProfile = {
  heading: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "contain" | "cover";
  items: string[];
  ctaLabel: string;
  ctaHref: string;
};

export function HowItWorksProfilePanel({
  heading,
  intro,
  imageSrc,
  imageAlt,
  imageFit = "contain",
  items,
  ctaLabel,
  ctaHref,
}: HowItWorksProfile) {
  const isCover = imageFit === "cover";

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div>
        <h3 className="font-space text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
          {heading}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
          {intro}
        </p>
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 md:text-base">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Link
          href={ctaHref}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div
        className={cn(
          "relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl lg:max-w-none",
          isCover
            ? "aspect-[5/4] min-h-[280px]"
            : "flex items-end justify-center bg-gradient-to-br from-sky-50 via-orange-50 to-slate-100 px-4 pt-6 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950",
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={isCover ? 960 : 420}
          height={isCover ? 720 : 420}
          className={
            isCover
              ? "h-full w-full object-cover object-[center_58%]"
              : "relative h-auto w-full max-w-[280px] object-contain drop-shadow-xl sm:max-w-[320px]"
          }
        />
      </div>
    </div>
  );
}
