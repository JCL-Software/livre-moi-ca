"use client";

import Image from "next/image";
import Check from "baseui/icon/check";
import { UberButtonLink } from "@/components/baseweb/uber-button-link";
import { KIND } from "baseui/button";
import { cn } from "@/lib/utils";

export type HowItWorksProfile = {
  heading: string;
  intro: string;
  introClassName?: string;
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
  introClassName,
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
        <h3 className="uber-card-title">
          {heading}
        </h3>
        <p
          className={cn(
            "uber-section-lead mt-3",
            introClassName ?? "max-w-lg",
          )}
        >
          {intro}
        </p>
        <ul className="mt-5 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[16px] leading-6 text-[#545454]">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
                <Check size={14} color="#fff" title="" />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <UberButtonLink href={ctaHref} kind={KIND.primary}>
            {ctaLabel}
          </UberButtonLink>
        </div>
      </div>
      <div
        className={cn(
          "relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl lg:max-w-none",
          isCover
            ? "aspect-[5/4] min-h-[280px]"
            : "flex items-end justify-center bg-[#F6F6F6] px-4 pt-6 dark:bg-neutral-900",
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={isCover ? 960 : 420}
          height={isCover ? 720 : 420}
          className={
            isCover
              ? "h-full w-full object-cover object-center"
              : "relative h-auto w-full max-w-[280px] object-contain drop-shadow-xl sm:max-w-[320px]"
          }
        />
      </div>
    </div>
  );
}
