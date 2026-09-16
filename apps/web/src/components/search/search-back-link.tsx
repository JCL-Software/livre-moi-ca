"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SiteBackLink } from "@/components/layout/site-page";

const STORAGE_KEY = "lm-search-back";

type BackTarget = {
  href: string;
  label: string;
};

const FALLBACK: BackTarget = { href: "/", label: "Colis" };

export function targetFromPath(pathname: string): BackTarget | null {
  if (!pathname || pathname.startsWith("/recherche")) return null;
  if (pathname === "/") return { href: "/", label: "Colis" };
  if (pathname.startsWith("/covoiturage")) return { href: "/covoiturage", label: "Covoiturage" };
  if (pathname.startsWith("/colis")) return { href: "/colis", label: "Colis" };
  if (pathname.startsWith("/compte")) return { href: "/compte", label: "Compte" };
  if (pathname.startsWith("/calculateur")) return { href: "/calculateur", label: "Estimateur" };
  if (pathname.startsWith("/trajets/nouveau")) {
    return { href: "/trajets/nouveau", label: "Conduire" };
  }
  if (pathname.startsWith("/connexion")) return { href: "/connexion", label: "Connexion" };
  return { href: pathname, label: "Retour" };
}

function readStored(): BackTarget | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BackTarget;
    if (parsed?.href && parsed?.label) return parsed;
  } catch {
    return null;
  }
  return null;
}

function writeStored(target: BackTarget) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(target));
}

export function RememberSearchOrigin() {
  const pathname = usePathname();

  useEffect(() => {
    const target = targetFromPath(pathname);
    if (target) writeStored(target);
  }, [pathname]);

  return null;
}

export function SearchBackLink() {
  const [target, setTarget] = useState<BackTarget | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setTarget(stored);
      return;
    }
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      if (referrer && referrer.origin === window.location.origin) {
        const fromReferrer = targetFromPath(referrer.pathname);
        if (fromReferrer) {
          writeStored(fromReferrer);
          setTarget(fromReferrer);
          return;
        }
      }
    } catch {
      // ignore invalid referrer
    }
    setTarget(FALLBACK);
  }, []);

  if (!target) {
    return (
      <span
        className="mb-4 inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium"
        aria-hidden
      />
    );
  }

  return <SiteBackLink href={target.href}>{target.label}</SiteBackLink>;
}
