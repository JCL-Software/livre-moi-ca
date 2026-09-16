"use client";

import Link from "next/link";
import { Car, Package, Users } from "lucide-react";
import { KIND, SIZE } from "baseui/button";
import { ProgressSteps, NumberedStep } from "baseui/progress-steps";
import { UberButtonLink } from "@/components/baseweb/uber-button-link";
import {
  UberCard,
  UberIconTile,
  UberTag,
} from "@/components/baseweb/uber-ui";
import {
  COMMITMENT_BUTTON_FULL,
  COMMITMENT_STEP_OVERRIDES,
} from "@/components/marketing/commitment-shared";
import { LeafIcon } from "@/components/ui/leaf";
import { APP_NAME } from "@/lib/constants";

const HIGHLIGHTS = [
  {
    icon: Users,
    title: "Sièges partagés",
    text: "Chaque place occupée évite qu’un autre véhicule parte seul sur la même route.",
  },
  {
    icon: Package,
    title: "Coffres utiles",
    text: "Un colis avance dans un trajet déjà prévu, sans course de livraison dédiée.",
  },
  {
    icon: Car,
    title: "Corridors régionaux",
    text: "Québec et Ontario : des déplacements qui existent déjà, mieux remplis.",
  },
] as const;

const STEPS = [
  {
    title: "Un trajet, plusieurs utilités",
    paragraphs: [
      "Le conducteur se déplace déjà. Un passager occupe un siège libre ; un colis profite de l’espace disponible.",
      "Même kilomètre, plus d’utilité — Et moins de courses faites uniquement pour livrer ou se déplacer seul.",
    ],
  },
  {
    title: "Moins d’émissions par personne et par envoi",
    paragraphs: [
      "Répartir les kilomètres entre plusieurs passagers réduit l’empreinte carbone par personne.",
      "Faire voyager un colis dans un véhicule déjà en route évite souvent un déplacement dédié à la livraison. Chaque place ou chaque coffre partagé compte.",
    ],
  },
  {
    title: "Des corridors régionaux, pas une flotte de plus",
    paragraphs: [
      `${APP_NAME} n’ajoute pas de véhicules de livraison. Nous mettons en relation des trajets déjà planifiés.`,
      "De ville en ville, au Québec et en Ontario — Pour que sièges et coffres servent à la communauté avant d’être gaspillés.",
    ],
  },
  {
    title: "Une option plus responsable, au quotidien",
    paragraphs: [
      "Choisir le covoiturage ou le cotransportage, c’est un geste simple : utiliser ce qui est déjà en mouvement.",
      "Pas de grand discours sur le zéro émission absolu — Une pratique claire pour limiter les trajets inutiles, trajet après trajet.",
    ],
  },
  {
    title: "Transparence sur ce que nous faisons",
    paragraphs: [
      "Nous privilégions le partage des déplacements existants. Les impacts exacts dépendent du trajet, du véhicule et du taux d’occupation.",
      "Notre rôle est de rendre ce partage facile à trouver, à réserver et à suivre — Pour que le choix responsable soit aussi le choix pratique.",
    ],
  },
] as const;

const RELATED = [
  { href: "/securite", label: "Sécurité" },
  { href: "/covoiturage", label: "Covoiturage" },
  { href: "/colis", label: "Colis" },
  { href: "/conditions", label: "Conditions" },
] as const;

export function DurabilityPage() {
  return (
    <article>
      <section className="section-plain py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <UberTag>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <LeafIcon className="h-3 w-3" size={12} />
              Engagement
            </span>
          </UberTag>

          <h1 className="uber-home-title mt-4">
            Des sièges libres, des coffres utiles, moins de trajets inutiles
          </h1>

          <div className="uber-home-lead mt-4 max-w-3xl space-y-3">
            <p>
              C&apos;est notre promesse aux communautés du Québec et de
              l&apos;Ontario : faire avancer personnes et colis en utilisant des
              véhicules déjà en route. Le chemin sera partagé — Sièges, coffres et
              corridors régionaux — Plutôt qu&apos;une flotte de plus sur la route.
            </p>
            <p>
              Ces changements se construisent trajet après trajet. Voici comment{" "}
              {APP_NAME} s&apos;y prend, point par point.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <UberButtonLink href="/covoiturage" kind={KIND.primary} size={SIZE.compact}>
              Voir le covoiturage
            </UberButtonLink>
            <UberButtonLink href="/colis" kind={KIND.secondary} size={SIZE.compact}>
              Envoyer un colis
            </UberButtonLink>
          </div>
        </div>
      </section>

      <section className="section-muted py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
              <UberCard key={title} as="article">
                <UberIconTile size={36}>
                  <Icon className="h-4 w-4" size={16} />
                </UberIconTile>
                <h2 className="mt-3 text-sm font-semibold text-black">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {text}
                </p>
              </UberCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-plain py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <p className="uber-home-kicker mb-6">Point par point</p>
          <ProgressSteps
            current={-1}
            alwaysShowDescription
            overrides={{
              Root: {
                style: {
                  width: "100%",
                },
              },
            }}
          >
            {STEPS.map((step) => (
              <NumberedStep
                key={step.title}
                title={step.title}
                overrides={COMMITMENT_STEP_OVERRIDES}
              >
                <div className="space-y-3 text-sm leading-relaxed text-neutral-600 md:text-[15px] md:leading-6">
                  {step.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </NumberedStep>
            ))}
          </ProgressSteps>
        </div>
      </section>

      <section className="section-muted py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <UberCard>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-black">
                  Passer à l&apos;action
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Partagez un siège ou un coffre sur un trajet déjà prévu.
                  <br />
                  Le geste responsable devient aussi le choix pratique.
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:w-[13.5rem] md:grid-cols-1 md:shrink-0">
                <UberButtonLink
                  href="/recherche"
                  kind={KIND.primary}
                  size={SIZE.compact}
                  overrides={COMMITMENT_BUTTON_FULL}
                >
                  Trouver un trajet
                </UberButtonLink>
                <UberButtonLink
                  href="/trajets/nouveau"
                  kind={KIND.secondary}
                  size={SIZE.compact}
                  overrides={COMMITMENT_BUTTON_FULL}
                >
                  Proposer un trajet
                </UberButtonLink>
              </div>
            </div>
          </UberCard>

          <nav
            aria-label="Pages liées"
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#E2E2E2] pt-6 text-sm"
          >
            {RELATED.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-[#545454] underline-offset-4 hover:text-black hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </article>
  );
}
