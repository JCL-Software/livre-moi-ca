import type { LucideIcon } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";
import { cn } from "@/lib/utils";

type GradientFeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  accent: string;
};

export function GradientFeatureCard({
  icon: Icon,
  title,
  text,
  accent,
}: GradientFeatureCardProps) {
  return (
    <article
      className={cn(
        "feature-card relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-sm sm:p-8",
        accent,
      )}
    >
      <div className="relative z-10 max-w-md">
        <AnimateIcon animateOnView className="mb-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </span>
        </AnimateIcon>
        <h3 className="font-space text-xl font-extrabold text-white md:text-2xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/90 md:text-base">
          {text}
        </p>
      </div>
    </article>
  );
}
