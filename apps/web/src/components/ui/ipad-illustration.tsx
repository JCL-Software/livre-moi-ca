import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type IpadIllustrationProps = {
  content?: ReactNode;
  className?: string;
};

export function IpadIllustration({ content, className }: IpadIllustrationProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[520px]", className)}>
      <div className="absolute right-[14%] top-[-6px] z-20 h-[5px] w-[56px] rounded-full bg-neutral-500" />
      <div className="absolute right-[-5px] top-[20%] z-20 h-9 w-[5px] rounded-full bg-neutral-500" />
      <div className="absolute right-[-5px] top-[34%] z-20 h-14 w-[5px] rounded-full bg-neutral-500" />

      <div className="relative rounded-[2rem] bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-500 p-[9px] shadow-[0_28px_56px_-24px_rgba(15,23,42,0.5)] dark:from-neutral-600 dark:via-neutral-700 dark:to-neutral-900">
        <div className="relative overflow-hidden rounded-[1.55rem] bg-black ring-1 ring-black/40">
          <div className="absolute left-1/2 top-2.5 z-30 flex h-6 w-[88px] -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-black ring-1 ring-white/10">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
            <div className="absolute inset-0">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
