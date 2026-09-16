"use client";

import { useEffect, useState } from "react";
import { BaseWebProvider } from "@/components/baseweb/provider";
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
    <BaseWebProvider>
      {children}
      <ClientToaster />
    </BaseWebProvider>
  );
}
