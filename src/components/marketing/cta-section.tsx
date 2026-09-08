"use client";

import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { motion } from "motion/react";
import { AnimateIcon } from "@/components/ui/animate-icon";

export function CtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[clamp(1.4rem,0.9rem+2.2vw,2.5rem)] font-bold tracking-tight text-white max-md:leading-tight"
        >
          Votre colis est prêt à prendre la route?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-3xl text-base font-normal leading-relaxed text-white/70 md:text-lg"
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
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Envoyer un colis
            <AnimateIcon>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </AnimateIcon>
          </Link>
          <Link href="#estimation" className="btn-brand-ghost">
            Estimer le coût d&apos;un colis
          </Link>
          <Link href="/livrer" className="btn-brand-ghost">
            <Package className="h-5 w-5" />
            Je veux transporter un colis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
