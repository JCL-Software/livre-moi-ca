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
        "feature-card relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-sm sm:p-6",
        accent,
      )}
    >
      <div className="relative z-10 max-w-md">
        <AnimateIcon animateOnView className="mb-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
            <Icon className="h-5 w-5" />
          </span>
        </AnimateIcon>
        <h3 className="font-space text-lg font-extrabold text-white md:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/90">
          {text}
        </p>
      </div>
    </article>
  );
}
