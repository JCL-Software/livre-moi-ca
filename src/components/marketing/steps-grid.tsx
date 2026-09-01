import type { LucideIcon } from "lucide-react";
import { AnimateIcon } from "@/components/ui/animate-icon";

export type StepItem = {
  step: number;
  icon: LucideIcon;
  title: string;
  text: string;
};

export function StepsGrid({ steps }: { steps: StepItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {steps.map(({ step, icon: Icon, title, text }) => (
        <div
          key={step}
          className="feature-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold text-white">
              {step}
            </span>
            <AnimateIcon animateOnView>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                <Icon className="h-5 w-5" />
              </span>
            </AnimateIcon>
          </div>
          <h3 className="font-space text-lg font-bold text-slate-950 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}
