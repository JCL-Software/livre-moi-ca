type AppIcon = React.ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

export type StepItem = {
  step: number;
  icon: AppIcon;
  title: string;
  text: string;
};

export function StepsGrid({ steps }: { steps: StepItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {steps.map(({ step, icon: Icon, title, text }) => (
        <div
          key={step}
          className="feature-card rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-medium text-white dark:bg-white dark:text-black">
              {step}
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white">
              <Icon className="h-5 w-5" size={20} animateOnHover />
            </span>
          </div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
}
