"use client";

import { BellRing } from "@/components/animate-ui/icons/bell-ring";
import { CircleCheckBig } from "@/components/animate-ui/icons/circle-check-big";
import { GalleryHorizontal } from "@/components/animate-ui/icons/gallery-horizontal";
import { Route as RouteIcon } from "@/components/animate-ui/icons/route";
import { DeliveryConfirmScreen } from "@/components/marketing/delivery-confirm-screen";
import { DeliveryLockScreen } from "@/components/marketing/delivery-lock-screen";
import { LiveTrackingScreen } from "@/components/marketing/live-tracking-screen";
import { ParcelPhotosScreen } from "@/components/marketing/parcel-photos-screen";
import { IphoneIllustration } from "@/components/ui/iphone-illustration";
import { cn } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react";

const JOURNEY_STEPS = [
  {
    step: 1,
    icon: BellRing,
    title: "Demande acceptée",
    text: "Recevez une confirmation dès qu'un conducteur prend votre colis en charge.",
    accent: "text-black dark:text-white",
    preview: "accepted" as const,
  },
  {
    step: 2,
    icon: RouteIcon,
    title: "Suivi en direct",
    text: "Suivez la progression du trajet et échangez avec le conducteur dans le chat intégré.",
    accent: "text-black dark:text-white",
    preview: "tracking" as const,
  },
  {
    step: 3,
    icon: GalleryHorizontal,
    title: "Photos à chaque étape",
    text: "L'état du colis est photographié lors de la prise en charge et de la remise.",
    accent: "text-black dark:text-white",
    preview: "photos" as const,
  },
  {
    step: 4,
    icon: CircleCheckBig,
    title: "Livraison confirmée",
    text: "Le destinataire valide la réception avec un code ou un QR code généré par l'application.",
    accent: "text-black dark:text-white",
    preview: "confirm" as const,
  },
];

type Preview = "lock" | "accepted" | "tracking" | "photos" | "confirm";
type CardPreview = Exclude<Preview, "lock">;

const AUTO_SEQUENCE: { preview: Preview; ms: number }[] = [
  { preview: "lock", ms: 3000 },
  { preview: "accepted", ms: 3600 },
  { preview: "tracking", ms: 5200 },
  { preview: "photos", ms: 3600 },
  { preview: "confirm", ms: 3600 },
];

const IPHONE_PREVIEWS: Record<
  Preview,
  { content: ReactNode; islandLoading: string; islandDone: string; frameKey: string }
> = {
  lock: {
    content: <DeliveryLockScreen />,
    islandLoading: "Alerte",
    islandDone: "Livraison",
    frameKey: "step-1",
  },
  accepted: {
    content: <DeliveryLockScreen accepted />,
    islandLoading: "Alerte",
    islandDone: "Acceptée",
    frameKey: "step-1",
  },
  tracking: {
    content: <LiveTrackingScreen />,
    islandLoading: "Suivi",
    islandDone: "En route",
    frameKey: "tracking",
  },
  photos: {
    content: <ParcelPhotosScreen />,
    islandLoading: "Photo",
    islandDone: "Capturée",
    frameKey: "photos",
  },
  confirm: {
    content: <DeliveryConfirmScreen />,
    islandLoading: "Validation",
    islandDone: "Livré",
    frameKey: "confirm",
  },
};

function activeCard(preview: Preview): CardPreview {
  return preview === "lock" ? "accepted" : preview;
}

export function TrustJourney() {
  const [autoIndex, setAutoIndex] = useState(0);
  const [hoverPreview, setHoverPreview] = useState<CardPreview | null>(null);

  useEffect(() => {
    if (hoverPreview) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeout = window.setTimeout(() => {
      setAutoIndex((index) => (index + 1) % AUTO_SEQUENCE.length);
    }, AUTO_SEQUENCE[autoIndex].ms);

    return () => window.clearTimeout(timeout);
  }, [autoIndex, hoverPreview]);

  const preview = hoverPreview ?? AUTO_SEQUENCE[autoIndex].preview;
  const current = IPHONE_PREVIEWS[preview];
  const highlighted = activeCard(preview);

  return (
    <>
      <div className="mb-10 flex min-h-[395px] items-center justify-center lg:mb-12">
        <IphoneIllustration
          key={current.frameKey}
          content={current.content}
          islandLoading={current.islandLoading}
          islandDone={current.islandDone}
        />
      </div>

      <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[12%] right-[12%] top-[18px] hidden h-0.5 bg-black lg:block"
        />
        {JOURNEY_STEPS.map(({ step, icon: Icon, title, text, accent, preview: cardPreview }) => {
          const isActive = highlighted === cardPreview;
          return (
            <li
              key={title}
              className="relative flex flex-col"
              onMouseEnter={() => setHoverPreview(cardPreview)}
              onMouseLeave={() => setHoverPreview(null)}
            >
              <div className="mb-4 flex justify-center lg:mb-5">
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-extrabold text-white shadow-sm ring-4 ring-white dark:bg-white dark:text-slate-950 dark:ring-slate-950">
                  {step}
                </span>
              </div>
              <article
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "feature-card flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm before:hidden dark:border-neutral-800 dark:bg-neutral-900",
                  isActive && "is-active",
                )}
              >
                <span
                  className={cn(
                    "mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F6F6F6] dark:bg-neutral-800",
                    accent,
                  )}
                >
                  <Icon size={22} animate={isActive} animateOnHover />
                </span>
                <h3 className="text-base font-semibold text-black dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {text}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </>
  );
}
