"use client";

import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

export function Timeline({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeight(entry.contentRect.height);
    });
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <div ref={ref} className="relative mx-auto max-w-4xl pb-8">
        {data.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex justify-start pt-8 md:gap-10 md:pt-12"
          >
            <div className="sticky top-28 z-10 flex max-w-xs flex-col items-center self-start md:w-40 md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-neutral-950 md:left-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-black text-xs font-semibold text-white dark:border-white/20 dark:bg-white dark:text-black">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <h3 className="hidden pl-20 text-xl font-bold text-black md:block dark:text-white">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pl-16 pr-4 md:pl-4">
              <h3 className="mb-3 block text-left text-lg font-bold text-black md:hidden dark:text-white">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700 md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-black via-neutral-600 to-transparent from-[0%] via-[10%] dark:from-white dark:via-neutral-300"
          />
        </div>
      </div>
    </div>
  );
}
