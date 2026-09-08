import type { LucideIcon } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";

type GradientFeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  accent?: string;
};

export function GradientFeatureCard({
  icon: Icon,
  title,
  text,
}: GradientFeatureCardProps) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-neutral-900">
      <AnimateIcon animateOnView className="mb-4">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
          <Icon className="h-5 w-5" />
        </span>
      </AnimateIcon>
      <h3 className="text-lg font-bold tracking-tight text-black md:text-xl dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {text}
      </p>
    </article>
  );
}
