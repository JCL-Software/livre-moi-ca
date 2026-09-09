"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

export function CarpoolOfferCtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-white md:text-4xl"
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
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Proposer des places libres
            <ArrowRight className="h-5 w-5" size={20} animateOnHover />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
