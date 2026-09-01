"use client";

import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { motion } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";

export function CarpoolCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f] py-16 md:py-20">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-space text-3xl font-extrabold text-white md:text-4xl lg:text-5xl"
        >
          Prêt à prendre la route ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-lg font-medium text-orange-100"
        >
          Ne faites plus la 117 en solo. Économisez de l&apos;argent et faites de belles
          rencontres régionales.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/recherche?type=PASSENGER"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Trouver un covoiturage
            <AnimateIcon>
              <ArrowRight className="h-5 w-5" />
            </AnimateIcon>
          </Link>
          <Link
            href="/trajets/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            <AnimateIcon>
              <Car className="h-5 w-5" />
            </AnimateIcon>
            Proposer des places libres
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
