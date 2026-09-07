"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function CarpoolOfferCtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1a4a7a] to-[#0d2d4f] py-16 md:py-20">
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-space text-3xl font-extrabold text-white md:text-4xl"
        >
          Votre prochain trajet peut aussi accueillir des passagers.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <Link
            href="/trajets/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Proposer des places libres
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
