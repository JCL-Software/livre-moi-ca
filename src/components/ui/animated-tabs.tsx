"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
};

const defaultActiveClass =
  "bg-orange-500 shadow-lg shadow-orange-500/25 dark:bg-orange-500 dark:shadow-orange-500/20";

export const AnimatedTabs = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  layoutId = "animated-tabs-pill",
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  layoutId?: string;
}) => {
  const [activeValue, setActiveValue] = useState(tabs[0]?.value ?? "");
  const activeTab = tabs.find((tab) => tab.value === activeValue) ?? tabs[0];

  return (
    <>
      <div
        className={cn(
          "no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible",
          containerClassName,
        )}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeValue === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveValue(tab.value)}
              className={cn(
                "relative rounded-full px-4 py-2 transition-colors",
                tabClassName,
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={layoutId}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    defaultActiveClass,
                    activeTabClassName,
                  )}
                />
              )}
              <span
                className={cn(
                  "relative block font-semibold",
                  isActive
                    ? "text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                )}
              >
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className={cn("mt-8 md:mt-12", contentClassName)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.value}
            role="tabpanel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {activeTab.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};
