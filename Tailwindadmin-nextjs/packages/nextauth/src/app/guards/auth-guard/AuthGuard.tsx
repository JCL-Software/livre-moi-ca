"use client";

import { usePathname, useRouter } from "next/navigation";
import useAuth from "./UseAuth";
import { useEffect } from "react";

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isInitialized, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace("/auth/auth1/login");
    }
  }, [isAuthenticated, isAdmin, isInitialized, pathname, router]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-darklink">
        Vérification de la session admin…
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return children;
};

export default AuthGuard;
