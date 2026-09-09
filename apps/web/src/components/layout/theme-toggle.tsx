"use client";

import { useEffect, useState } from "react";
import { useAnimationControls } from "motion/react";
import { useTheme } from "next-themes";
import { Moon } from "@/components/animate-ui/icons/moon";
import { Sun } from "@/components/animate-ui/icons/sun";
import {
  Switch,
  SwitchThumb,
} from "@/components/animate-ui/primitives/radix/switch";
import { cn } from "@/lib/utils";

/** Gris clair lisible sur le header noir (#F6F6F6 se confondait avec le blanc). */
const LIGHT_TRACK = "#D4D4D4";
const DARK_TRACK = "#0A0A0A";

/** Même mouvement que Animate UI ToggleRight `default` (sans boucle). */
const THUMB_NUDGE = {
  x: [0, -3, -2.5, 0],
  transition: { duration: 0.5, ease: "easeInOut" as const },
};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const thumbControls = useAnimationControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    void thumbControls.start(THUMB_NUDGE);
  }, [mounted, thumbControls]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  function playThumbAnimation() {
    void thumbControls.start(THUMB_NUDGE);
  }

  return (
    <Switch
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      disabled={!mounted}
      aria-label="Changer le thème"
      style={{ backgroundColor: isDark ? DARK_TRACK : LIGHT_TRACK }}
      onMouseEnter={playThumbAnimation}
      className={cn(
        "relative flex h-5 w-8 shrink-0 items-center rounded-full border px-px text-neutral-900 outline-none transition-colors",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Mode clair : pastille sombre à droite
        "data-[state=unchecked]:justify-end data-[state=unchecked]:border-transparent",
        // Mode sombre : pastille claire à gauche
        "data-[state=checked]:justify-start data-[state=checked]:border-white/20",
        className,
      )}
    >
      <Sun
        aria-hidden
        size={8}
        animateOnHover
        className={cn(
          "pointer-events-none absolute top-1/2 left-0.5 size-2 -translate-y-1/2 transition-colors",
          isDark ? "text-neutral-500" : "text-neutral-800",
        )}
      />
      <Moon
        aria-hidden
        size={8}
        animateOnHover
        className={cn(
          "pointer-events-none absolute top-1/2 right-0.5 size-2 -translate-y-1/2 transition-colors",
          isDark ? "text-neutral-300" : "text-neutral-600",
        )}
      />
      <SwitchThumb
        pressedAnimation={{ width: 18 }}
        animate={thumbControls}
        initial={{ x: 0 }}
        className={cn(
          "pointer-events-none relative z-10 block size-3.5 rounded-full ring-0",
          "data-[state=unchecked]:bg-neutral-900",
          "data-[state=checked]:bg-neutral-400",
        )}
      />
    </Switch>
  );
}
