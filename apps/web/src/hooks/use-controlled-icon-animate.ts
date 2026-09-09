"use client";

import { useEffect } from "react";
import type { LegacyAnimationControls } from "motion/react";

/** Sync lucide-animated `controls` with a parent-driven `animate` boolean. */
export function useControlledIconAnimate(
  animate: boolean | undefined,
  controls: LegacyAnimationControls,
) {
  useEffect(() => {
    if (animate === undefined) return;
    void controls.start(animate ? "animate" : "normal");
  }, [animate, controls]);
}
