"use client";

import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { motion } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";

export function CarpoolCtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          Prêt à prendre la route ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-lg font-normal text-white/70"
        >
          Ne faites plus vos trajets en solo. Économisez de l&apos;argent en covoiturant ou
          proposez vos places libres, tout en faisant de belles rencontres régionales.
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
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Trouver un covoiturage
            <AnimateIcon>
              <ArrowRight className="h-5 w-5" />
            </AnimateIcon>
          </Link>
          <Link href="/trajets/nouveau" className="btn-brand-ghost">
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
