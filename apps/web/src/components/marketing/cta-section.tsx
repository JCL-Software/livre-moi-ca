"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { motion } from "motion/react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

export function CtaSection() {
  return (
    <section className="bg-black py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="uber-section-title uber-section-title-inverse max-md:leading-tight"
        >
          Prêt à estimer ou à transporter ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="uber-section-lead mx-auto mt-3 max-w-xl text-white/70"
        >
          Calculez le coût indicatif de votre envoi, ou proposez de
          transporter un colis sur un trajet que vous faites déjà.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
        >
          <Link
            href="/colis/nouveau"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-base font-medium text-black transition-colors hover:bg-neutral-200"
          >
            Envoyer un colis
            <ArrowRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              size={20}
              animateOnHover
            />
          </Link>
          <Link href="/calculateur" className="btn-brand-ghost">
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
