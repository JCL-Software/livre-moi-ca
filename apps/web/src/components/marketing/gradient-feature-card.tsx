"use client";

import { UberCard, UberIconTile } from "@/components/baseweb/uber-ui";

type AppIcon = React.ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

type GradientFeatureCardProps = {
  icon: AppIcon;
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
    <UberCard as="article">
      <UberIconTile>
        <Icon size={20} />
      </UberIconTile>
      <h3 className="mt-4 mb-0 text-[15px] font-semibold leading-snug text-black">{title}</h3>
      <p className="mt-1.5 mb-0 text-[13px] leading-5 text-[#545454]">{text}</p>
    </UberCard>
  );
}
