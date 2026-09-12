import type { ComponentType, SVGProps } from "react";

type AppIcon = ComponentType<{
  className?: string;
  size?: number;
  animateOnHover?: boolean;
}>;

export function withoutHoverProp(
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>,
): AppIcon {
  return function StaticIcon({ animateOnHover: _animateOnHover, ...props }) {
    return <Icon {...props} />;
  };
}
