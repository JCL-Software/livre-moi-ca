import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import type { StepItem } from "@/components/marketing/steps-grid";

type TrustPoint = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type HowItWorksProfile = {
  heading: string;
  intro: string;
  imageSrc: string;
  imageAlt: string;
  stepsTitle: string;
  steps: StepItem[];
  ctaLabel: string;
  ctaHref: string;
  closingTitle: string;
  closingText: string;
  trust: TrustPoint[];
};

export function HowItWorksProfilePanel({
  heading,
  intro,
  imageSrc,
  imageAlt,
  stepsTitle,
  steps,
  ctaLabel,
  ctaHref,
  closingTitle,
  closingText,
  trust,
}: HowItWorksProfile) {
  return (
    <div className="space-y-10 md:space-y-12">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <div>
          <h3 className="font-space text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-3xl">
            {heading}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
            {intro}
          </p>
        </div>
        <div className="relative mx-auto flex w-full max-w-sm items-end justify-center rounded-3xl bg-gradient-to-br from-sky-50 via-orange-50 to-slate-100 px-4 pt-6 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 lg:max-w-none">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={420}
            height={420}
            className="relative h-auto w-full max-w-[280px] object-contain drop-shadow-xl sm:max-w-[320px]"
          />
        </div>
      </div>

      <div>
        <h4 className="font-space text-xl font-bold text-slate-950 dark:text-white md:text-2xl">
          {stepsTitle}
        </h4>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {steps.map(({ step, icon: Icon, title, text }) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold text-white">
                {step}
              </span>
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <AnimateIcon animateOnView>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                      <Icon className="h-4 w-4" />
                    </span>
                  </AnimateIcon>
                  <p className="font-space text-base font-bold text-slate-950 dark:text-white">
                    {title}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 md:p-8">
        <p className="text-sm font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
          Sécurité et confiance
        </p>
        <h4 className="mt-2 font-space text-xl font-bold text-slate-950 dark:text-white">
          Votre tranquillité d&apos;abord
        </h4>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {trust.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
            >
              <AnimateIcon animateOnView className="mb-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1E3A5F] text-orange-400">
                  <Icon className="h-5 w-5" />
                </span>
              </AnimateIcon>
              <p className="font-space text-sm font-bold text-slate-950 dark:text-white">
                {title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f] px-6 py-8 text-center md:px-10 md:py-10">
        <p className="text-sm font-extrabold uppercase tracking-wider text-orange-300">
          Prêt à commencer
        </p>
        <h4 className="mt-2 font-space text-2xl font-extrabold text-white md:text-3xl">
          {closingTitle}
        </h4>
        <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-orange-100 md:text-base">
          {closingText}
        </p>
        <Link
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
        >
          {ctaLabel}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
