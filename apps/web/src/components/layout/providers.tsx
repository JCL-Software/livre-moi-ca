"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // React 19 / Next 16 : évite l’avertissement sur <script> injecté par next-themes
  // côté client, tout en laissant le script FOUC s’exécuter correctement en SSR.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      scriptProps={scriptProps}
    >
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}
