"use client";

import Link from "next/link";
import { Check } from "@/components/animate-ui/icons/check";
import { SearchForm } from "@/components/search/search-form";

const BENEFITS = [
  "Suivi en direct",
  "Chat intégré avec le conducteur",
  "Photo et confirmation à la remise",
];

export function EstimationSection() {
  return (
    <section
      id="estimation"
      className="section-muted scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="uber-home-kicker">
              Un trajet déjà prévu ?
            </p>
            <h2 className="uber-section-title mt-2">
              Un conducteur est déjà en route ?
            </h2>
            <p className="uber-section-lead mt-3">
              Si un trajet correspond déjà à votre route, vous pouvez réserver
              le coffre. Sinon, publiez votre annonce : elle est publique et
              les conducteurs peuvent vous proposer un transport
            </p>

            <ul className="mt-8 space-y-3">
              {BENEFITS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-[13px] font-medium text-neutral-700 dark:text-neutral-300"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    <Check className="h-3.5 w-3.5" size={14} animateOnHover />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-7 dark:bg-neutral-900 dark:ring-white/10">
            <SearchForm
              appearance="navy"
              defaultType="PARCEL"
              showTypeToggle={false}
              submitLabel="Voir les trajets déjà prévus"
            />
            <p className="mt-4 mb-0 text-sm text-[#545454]">
              Pas de trajet correspondant ?{" "}
              <Link href="/colis/nouveau" className="uber-search-secondary">
                Publier un colis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
