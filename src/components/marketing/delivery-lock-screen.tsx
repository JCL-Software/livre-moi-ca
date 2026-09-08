"use client";

import Image from "next/image";
import { Camera, Flashlight, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type DeliveryLockScreenProps = {
  accepted?: boolean;
};

export function DeliveryLockScreen({ accepted = false }: DeliveryLockScreenProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#07111f] px-3.5 pb-8 pt-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.28),transparent_52%)]" />
      <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-56 -translate-x-1/2 rounded-full bg-sky-500/15 blur-3xl" />

      <motion.div
        animate={{ opacity: accepted ? 0 : 1, height: accepted ? 0 : "auto" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative overflow-hidden text-center"
      >
        <Lock className="mx-auto mb-2 h-3.5 w-3.5 text-white/70" aria-hidden="true" />
        <p className="font-space text-[46px] font-extrabold leading-none tracking-tight">
          19:42
        </p>
        <p className="mt-1 text-[11px] font-semibold tracking-wide text-white/70">
          lundi 7 septembre
        </p>
      </motion.div>

      <motion.div
        animate={{ opacity: accepted ? 1 : 0, height: accepted ? "auto" : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative overflow-hidden text-center"
      >
        <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-300">
          Notification
        </p>
        <h2 className="mt-1 font-space text-lg font-extrabold leading-tight">
          Demande acceptée
        </h2>
      </motion.div>

      <motion.div
        layout
        className="relative mt-6 rounded-2xl bg-white/16 p-2.5 shadow-lg ring-1 ring-white/20 backdrop-blur-md"
      >
        <AnimatePresence mode="wait" initial={false}>
          {accepted ? (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-extrabold">
                  A
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">Alex B.</p>
                  <p className="text-[11px] text-sky-100">Conducteur vérifié</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] font-semibold leading-snug text-sky-50">
                Val-d&apos;Or → Gatineau
              </p>
              <p className="mt-1 text-[11px] text-white/70">Départ demain, 7 h 30</p>
            </motion.div>
          ) : (
            <motion.div
              key="offer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-2.5"
            >
              <Image
                src="/brand/logo-pin.webp"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-contain"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-[11px] font-bold">Livre-moi.ca</p>
                  <p className="text-[9px] text-white/55">maintenant</p>
                </div>
                <p className="mt-0.5 text-[12px] font-extrabold leading-tight">
                  Livraison disponible
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-white/75">
                  Val-d&apos;Or → Gatineau
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative mt-auto">
        <AnimatePresence mode="wait" initial={false}>
          {accepted ? (
            <motion.div
              key="taken"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-orange-500/20 px-3 py-2 text-center text-[11px] font-bold text-orange-100"
            >
              Votre colis est pris en charge
            </motion.div>
          ) : (
            <motion.div
              key="tools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-between px-3 pb-1"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Flashlight className="h-4 w-4 text-white/80" aria-hidden="true" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Camera className="h-4 w-4 text-white/80" aria-hidden="true" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
