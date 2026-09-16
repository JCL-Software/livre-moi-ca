"use client";

import Link from "next/link";
import { Lock, Share2, ShieldCheck } from "lucide-react";
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
import { APP_NAME } from "@/lib/constants";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Profils vérifiés",
    text: "Identité, véhicule et avis visibles avant de réserver un siège ou un colis.",
  },
  {
    icon: Share2,
    title: "Partage de trajet",
    text: "Un proche suit votre position et votre trajet en direct, via un lien sécurisé.",
  },
  {
    icon: Lock,
    title: "Paiement protégé",
    text: "Tarif clair avant réservation, paiement en ligne — Sans argent comptant.",
  },
] as const;

const STEPS = [
  {
    title: "Des conducteurs vérifiés avant le premier trajet",
    paragraphs: [
      "Avant de proposer des places ou de transporter un colis, chaque conducteur doit compléter les étapes requises : profil, confirmation d’identité et informations du véhicule.",
      "Ces éléments restent visibles pour vous aider à choisir — Ils ne remplacent pas votre jugement sur le terrain.",
    ],
  },
  {
    title: "Partagez votre trajet avec un proche",
    paragraphs: [
      "Avec le partage de trajet sécurisé, vous envoyez un lien à un contact de confiance.",
      "Celui-ci voit votre position en temps réel, le trajet prévu, l’heure d’arrivée estimée et les détails pertinents sur le chauffeur. Le partage s’arrête automatiquement à la fin du trajet, ou manuellement.",
    ],
  },
  {
    title: "Vos échanges restent dans l’application",
    paragraphs: [
      "La messagerie liée au trajet garde un historique clair et évite de partager trop tôt un numéro de téléphone ou une adresse personnelle.",
      "Les détails utiles au départ et à l’arrivée se coordonnent là où la réservation a été faite.",
    ],
  },
  {
    title: "Paiement en ligne, sans argent comptant",
    paragraphs: [
      "Le tarif est affiché avant la réservation. Le paiement passe par la plateforme.",
      `Pas d’échange d’espèces entre passager et conducteur, ni entre expéditeur et transporteur pour une réservation faite sur ${APP_NAME}.`,
    ],
  },
  {
    title: "Preuves et confirmation pour les colis",
    paragraphs: [
      "Pour le cotransportage, photos à chaque étape et code de confirmation à la remise aident à documenter l’échange.",
      "En cas de doute, l’historique du trajet et les preuves restent disponibles pour le support.",
    ],
  },
  {
    title: "Nous sommes là pour vous aider",
    paragraphs: [
      "En cas de problème, utilisez d’abord la messagerie du trajet, puis le support.",
      "Si vous êtes en danger immédiat, contactez d’abord les autorités (911). Ne montez jamais dans un véhicule si vous ne vous sentez pas en sécurité.",
    ],
  },
] as const;

const RELATED = [
  { href: "/durabilite", label: "Durabilité" },
  { href: "/covoiturage", label: "Covoiturage" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/conditions", label: "Conditions" },
] as const;

export function SafetyPage() {
  return (
    <article>
      <section className="section-plain py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <UberTag>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
              <ShieldCheck className="h-3 w-3" size={12} />
              Engagement
            </span>
          </UberTag>

          <h1 className="uber-home-title mt-4">
            Notre engagement envers la sécurité
          </h1>

          <div className="uber-home-lead mt-4 max-w-3xl space-y-3">
            <p>
              Nous voulons que vous puissiez voyager et faire circuler un colis
              entre le Québec et l&apos;Ontario avec plus de sérénité — En sachant
              avec qui vous partagez la route, et en gardant le contrôle sur vos
              informations.
            </p>
            <p>
              La sécurité nous tient à cœur. {APP_NAME} combine vérifications,
              outils dans l&apos;application et transparence avant le départ pour
              réduire les risques — Sans prétendre les éliminer tous.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <UberButtonLink href="/covoiturage" kind={KIND.primary} size={SIZE.compact}>
              Voir le covoiturage
            </UberButtonLink>
            <UberButtonLink
              href="/confidentialite"
              kind={KIND.secondary}
              size={SIZE.compact}
            >
              Confidentialité
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
                  Voyager plus sereinement
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Consultez les profils et les conditions avant de réserver.
                  <br />
                  La confiance commence avant le départ.
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
                  href="/durabilite"
                  kind={KIND.secondary}
                  size={SIZE.compact}
                  overrides={COMMITMENT_BUTTON_FULL}
                >
                  Voir la durabilité
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
