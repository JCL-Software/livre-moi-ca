"use client";

import Link from "next/link";
import { IconBrandGoogle } from "@tabler/icons-react";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { UberCard } from "@/components/baseweb/uber-ui";
import { SitePage } from "@/components/layout/site-page";
import { cn } from "@/lib/utils";

export function AuthFormShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <SitePage>
      <div className="mx-auto max-w-md space-y-6">
        <UberPageIntro title={title} subtitle={subtitle} />
        <UberCard>{children}</UberCard>
      </div>
    </SitePage>
  );
}

export function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col", className)}>{children}</div>
  );
}

export function AuthSubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      className="btn-brand mt-2 h-14 w-full disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function AuthGoogleButton({
  action,
}: {
  action: () => void | Promise<void>;
}) {
  return (
    <button
      className="btn-brand-secondary h-14 w-full gap-2"
      type="button"
      onClick={() => {
        void action();
      }}
    >
      <IconBrandGoogle className="h-4 w-4" aria-hidden />
      Continuer avec Google
    </button>
  );
}

export function AuthDivider() {
  return <div className="my-6 h-px w-full bg-[#DDDDDD]" />;
}

export function AuthFooterLink({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="text-center text-sm text-[#545454]">
      {prompt}{" "}
      <Link href={href} className="font-medium text-black underline underline-offset-4">
        {label}
      </Link>
    </p>
  );
}

export function AuthLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="uber-home-kicker mb-1.5 block">
      {children}
    </label>
  );
}
