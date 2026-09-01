"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type AnimateIconProps = HTMLMotionProps<"span"> & {
  animateOnHover?: boolean;
  animateOnView?: boolean;
};

export function AnimateIcon({
  children,
  className,
  animateOnHover = true,
  animateOnView = false,
  ...props
}: AnimateIconProps) {
  return (
    <motion.span
      className={cn("inline-flex shrink-0", className)}
      whileHover={animateOnHover ? { scale: 1.12, rotate: -4 } : undefined}
      whileTap={{ scale: 0.92 }}
      initial={animateOnView ? { opacity: 0, y: 8 } : false}
      whileInView={animateOnView ? { opacity: 1, y: 0 } : undefined}
      viewport={animateOnView ? { once: true, margin: "-40px" } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
