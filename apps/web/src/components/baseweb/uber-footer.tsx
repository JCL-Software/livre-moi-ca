"use client";

import Link from "next/link";
import { Heading, HeadingLevel } from "baseui/heading";
import { StyledLink } from "baseui/link";
import { ParagraphXSmall } from "baseui/typography";
import { BrandLogo } from "@/components/layout/brand-logo";
import { LEGAL_LINKS } from "@/components/legal/legal-links";

const NAV = [
  { href: "/colis/nouveau", label: "Publier un colis" },
  { href: "/recherche", label: "Voir les trajets" },
  { href: "/colis", label: "Colis disponibles" },
  { href: "/calculateur", label: "Estimer le coût" },
  { href: "/trajets/nouveau", label: "Publier un trajet" },
  { href: "/connexion", label: "Connexion" },
];

const ENGAGEMENTS = [
  { href: "/securite", label: "Sécurité" },
  { href: "/durabilite", label: "Durabilité" },
];

const legalLinkStyle = {
  color: "rgba(255, 255, 255, 0.55)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--text-xs)",
  fontWeight: 400,
  lineHeight: "var(--leading-xs)",
  textDecoration: "none",
  transitionProperty: "color",
  transitionDuration: "150ms",
  ":hover": {
    color: "#ffffff",
  },
  ":focus-visible": {
    color: "#ffffff",
    outline: "1px solid rgba(255, 255, 255, 0.4)",
    outlineOffset: "2px",
  },
} as const;

export function UberFooter() {
  return (
    <footer className="uber-footer">
      <div className="uber-footer-grid">
        <div className="uber-footer-brand">
          <BrandLogo variant="light" />
          <p>
            Des personnes et des colis qui avancent
            <br />
            ensemble au Québec et en Ontario.
          </p>
        </div>
        <div>
          <HeadingLevel>
            <Heading styleLevel={6}>Produit</Heading>
          </HeadingLevel>
          <ul>
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <HeadingLevel>
            <Heading styleLevel={6}>Engagements</Heading>
          </HeadingLevel>
          <ul>
            {ENGAGEMENTS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <HeadingLevel>
            <Heading styleLevel={6}>Territoire</Heading>
          </HeadingLevel>
          <p>De ville en ville, au Québec et en Ontario.</p>
        </div>
      </div>
      <div className="uber-footer-legal">
        <ParagraphXSmall
          marginTop={0}
          marginBottom={0}
          color="rgba(255, 255, 255, 0.5)"
          overrides={{
            Block: {
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                lineHeight: "var(--leading-xs)",
              },
            },
          }}
        >
          © 2026 Livre-moi.ca. Tous droits réservés.
        </ParagraphXSmall>
        <nav aria-label="Informations légales" className="uber-footer-legal-nav">
          {LEGAL_LINKS.map((link, index) => (
            <span key={link.href} className="uber-footer-legal-item">
              {index > 0 ? (
                <span className="uber-footer-legal-sep" aria-hidden="true" />
              ) : null}
              <StyledLink
                $as={Link}
                href={link.href}
                animateUnderline
                style={legalLinkStyle}
              >
                {link.label}
              </StyledLink>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
