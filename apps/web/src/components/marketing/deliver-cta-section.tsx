"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

export function DeliverCtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="uber-section-title uber-section-title-inverse"
        >
          Votre prochain trajet peut aussi transporter un colis.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/trajets/nouveau"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Publier mon trajet
            <ArrowRight className="h-5 w-5" size={20} animateOnHover />
          </Link>
          <Link
            href="/colis"
            className="text-base font-medium text-white underline-offset-4 hover:underline"
          >
            Voir les colis disponibles
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
