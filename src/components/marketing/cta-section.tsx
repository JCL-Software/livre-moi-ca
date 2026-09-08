"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { motion } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";

export function CtaSection() {
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
          transition={{ duration: 0.5 }}
          className="font-space text-[clamp(1.2rem,0.75rem+2.1vw,2.2rem)] font-extrabold text-white whitespace-nowrap max-md:whitespace-normal max-md:leading-tight"
        >
          Votre colis est prêt à prendre la route?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl text-base font-medium leading-relaxed text-orange-100 md:text-lg"
        >
          Trouvez un trajet existant, coordonnez une remise simple
          <br />
          et faites avancer votre colis avec quelqu&apos;un qui va déjà dans la
          bonne direction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
        >
          <Link
            href="/recherche?type=PARCEL"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-extrabold text-white shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Envoyer un colis
            <AnimateIcon>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </AnimateIcon>
          </Link>
          <Link
            href="#estimation"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            Estimer le coût d&apos;un colis
          </Link>
          <Link
            href="/livrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-extrabold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            <Package className="h-5 w-5" />
            Je veux transporter un colis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
