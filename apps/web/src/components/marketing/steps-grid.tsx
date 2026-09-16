"use client";

import { UberCard, UberIconTile } from "@/components/baseweb/uber-ui";

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
        <UberCard key={step}>
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
              {step}
            </span>
            <UberIconTile>
              <Icon size={20} />
            </UberIconTile>
          </div>
          <h3 className="m-0 text-[15px] font-semibold leading-snug text-black">{title}</h3>
          <p className="mt-2 mb-0 text-[13px] leading-5 text-[#545454]">{text}</p>
        </UberCard>
      ))}
    </div>
  );
}
