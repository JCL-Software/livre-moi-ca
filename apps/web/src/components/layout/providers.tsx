"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

function ClientToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Toaster position="top-center" />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ClientToaster />
    </ThemeProvider>
  );
}
