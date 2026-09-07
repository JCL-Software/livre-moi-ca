"use client";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "./UseAuth";
import { useEffect } from "react";

type GuestGuardProps = {
  children: React.ReactNode;
};

const GuestGuard = ({ children }: GuestGuardProps) => {
  const { isAuthenticated, isAdmin, isInitialized } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (isAuthenticated && isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isInitialized, pathname, router]);

  return children;
};

export default GuestGuard;
