import Link from "next/link";
import { Package } from "lucide-react";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";

export function CarpoolColisTransition() {
  return (
    <section className="section-plain py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8 dark:border-white/10 dark:bg-neutral-950">
          <div className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F6F6F6] text-black dark:bg-neutral-900 dark:text-white">
              <Package className="h-5 w-5" />
            </span>
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold tracking-tight text-black md:text-2xl dark:text-white">
                Vous conduisez déjà ?
                <br />
                Vous pouvez aussi transporter un colis.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
                Lorsque votre trajet le permet, utilisez l’espace disponible dans
                votre véhicule pour aider un autre membre à faire avancer un colis.
              </p>
            </div>
          </div>
          <Link href="/" className="btn-brand-secondary shrink-0">
            Découvrir le transport de colis
            <ArrowRight size={16} className="h-4 w-4" animateOnHover />
          </Link>
        </div>
      </div>
    </section>
  );
}
