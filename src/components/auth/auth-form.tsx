"use client";

import Link from "next/link";
import { IconBrandGoogle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function AuthFormShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center bg-[#F6F6F6] px-4 py-16 dark:bg-black">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          {title}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
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
    <div className={cn("flex w-full flex-col gap-2", className)}>{children}</div>
  );
}

export function BottomGradient() {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
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
      className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
      type="submit"
      disabled={disabled}
    >
      {children}
      <BottomGradient />
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
      className="group/btn shadow-input relative flex h-10 w-full items-center justify-start gap-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:text-white dark:shadow-[0px_0px_1px_1px_#262626]"
      type="button"
      onClick={() => {
        void action();
      }}
    >
      <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        Continuer avec Google
      </span>
      <BottomGradient />
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
  );
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
    <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-neutral-800 underline underline-offset-4 dark:text-neutral-200"
      >
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
    <label
      htmlFor={htmlFor}
      className="text-sm leading-none font-medium text-black peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
    >
      {children}
    </label>
  );
}
