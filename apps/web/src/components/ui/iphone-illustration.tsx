"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

type IslandPhase = "idle" | "loading" | "expanded";

type IphoneIllustrationProps = {
  content?: ReactNode;
  className?: string;
  islandLoading?: string;
  islandDone?: string;
};

export function IphoneIllustration({
  content,
  className,
  islandLoading = "Validation",
  islandDone = "Livré",
}: IphoneIllustrationProps) {
  const [islandRef, animateIsland] = useAnimate();
  const [phase, setPhase] = useState<IslandPhase>("idle");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const island = islandRef.current;
      if (!island) return;

      while (!cancelled) {
        setPhase("idle");
        await animateIsland(island, { width: 92, borderRadius: 999 }, { duration: 0.4, ease: "easeInOut" });
        await new Promise((resolve) => setTimeout(resolve, 900));
        if (cancelled) return;

        setPhase("loading");
        await animateIsland(island, { width: 128 }, { duration: 0.45, ease: "easeInOut" });
        await new Promise((resolve) => setTimeout(resolve, 1300));
        if (cancelled) return;

        setPhase("expanded");
        await animateIsland(island, { width: 168 }, { duration: 0.45, ease: "easeInOut" });
        await new Promise((resolve) => setTimeout(resolve, 2200));
        if (cancelled) return;
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [animateIsland, islandRef]);

  return (
    <div className={cn("relative mx-auto w-[220px]", className)}>
      <div className="absolute left-[-5px] top-[18%] z-20 h-7 w-[4px] rounded-full bg-neutral-500" />
      <div className="absolute left-[-5px] top-[28%] z-20 h-10 w-[4px] rounded-full bg-neutral-500" />
      <div className="absolute left-[-5px] top-[40%] z-20 h-10 w-[4px] rounded-full bg-neutral-500" />
      <div className="absolute right-[-5px] top-[26%] z-20 h-14 w-[4px] rounded-full bg-neutral-500" />

      <div className="relative rounded-[2.4rem] bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-500 p-[8px] shadow-[0_28px_56px_-24px_rgba(15,23,42,0.5)] dark:from-neutral-600 dark:via-neutral-700 dark:to-neutral-900">
        <div className="relative overflow-hidden rounded-[2rem] bg-black ring-1 ring-black/40">
          <div
            ref={islandRef}
            className="absolute left-1/2 top-3 z-30 flex h-7 w-[92px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-white/10"
          >
            {phase === "idle" ? (
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
              </div>
            ) : null}
            {phase === "loading" ? (
              <div className="flex items-center gap-1.5 px-2">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-orange-400"
                  animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.15, 0.85] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
                <span className="text-[9px] font-semibold tracking-wide text-white/85">
                  {islandLoading}
                </span>
              </div>
            ) : null}
            {phase === "expanded" ? (
              <div className="flex items-center gap-1.5 px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="truncate text-[9px] font-semibold tracking-wide text-white">
                  {islandDone}
                </span>
              </div>
            ) : null}
          </div>

          <div className="relative aspect-[9/19.5] w-full overflow-hidden bg-slate-950">
            <div className="absolute inset-0">{content}</div>
            <div className="absolute bottom-2 left-1/2 z-20 h-1 w-24 -translate-x-1/2 rounded-full bg-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}
