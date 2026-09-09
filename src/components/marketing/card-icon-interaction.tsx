"use client";

import {
  useCallback,
  useState,
  type ComponentType,
  type HTMLAttributes,
} from "react";
import type { LucideIcon } from "lucide-react";

export type AppIcon = ComponentType<{
  className?: string;
  size?: number;
  animate?: boolean | string;
  animateOnHover?: boolean;
  animation?: string;
}>;

/** Wraps a static Lucide icon so card `animate` props are not forwarded to the DOM. */
export function staticIcon(Icon: LucideIcon): AppIcon {
  function StaticIcon({
    className,
    size,
  }: {
    className?: string;
    size?: number;
    animate?: boolean;
    animateOnHover?: boolean;
  }) {
    return <Icon className={className} size={size} aria-hidden />;
  }
  StaticIcon.displayName = `Static(${Icon.displayName ?? Icon.name ?? "Icon"})`;
  return StaticIcon;
}

/** Active when the card is hovered or pressed — drive icon `animate={active}`. */
export function useCardIconActive() {
  const [active, setActive] = useState(false);
  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  return {
    active,
    cardProps: {
      onMouseEnter: activate,
      onMouseLeave: deactivate,
      onPointerDown: activate,
    } satisfies HTMLAttributes<HTMLElement>,
  };
}
