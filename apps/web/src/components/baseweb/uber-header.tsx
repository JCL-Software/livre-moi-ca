"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from "baseui/header-navigation";
import { Button, KIND, SHAPE, SIZE } from "baseui/button";
import { Drawer, ANCHOR } from "baseui/drawer";
import { BrandLogo } from "@/components/layout/brand-logo";
import { HeaderAccountLink } from "@/components/layout/header-account-link";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/", label: "Colis" },
  { href: "/colis", label: "Marketplace" },
  { href: "/colis/nouveau", label: "Publier un colis" },
  { href: "/covoiturage", label: "Covoiturage" },
  { href: "/recherche", label: "Rechercher" },
  { href: "/trajets/nouveau", label: "Conduire" },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/colis") {
    if (pathname === "/colis") return true;
    if (!pathname.startsWith("/colis/")) return false;
    return (
      !pathname.startsWith("/colis/nouveau") && !pathname.includes("/edit")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type UberHeaderUser = {
  email: string;
  name: string;
  avatarUrl: string | null;
  identityVerified: boolean;
  unreadNotifications: number;
};

export function UberHeader({ user }: { user: UberHeaderUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="uber-header">
      <HeaderNavigation
        overrides={{
          Root: {
            style: {
              backgroundColor: "#000000",
              borderBottomWidth: 0,
              paddingLeft: "16px",
              paddingRight: "16px",
              minHeight: "64px",
            },
          },
        }}
      >
        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem>
            <BrandLogo priority variant="light" />
          </StyledNavigationItem>
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.center} className="uber-header-desktop">
          {links.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <StyledNavigationItem key={link.href}>
                <Link
                  href={link.href}
                  className={active ? "uber-nav-link is-active" : "uber-nav-link"}
                >
                  {link.label}
                </Link>
              </StyledNavigationItem>
            );
          })}
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.right} className="uber-header-desktop">
          {user ? (
            <>
              <StyledNavigationItem>
                <Link href="/compte/notifications" className="uber-nav-link">
                  Activité
                  {user.unreadNotifications > 0 ? (
                    <span className="uber-nav-badge">{user.unreadNotifications}</span>
                  ) : null}
                </Link>
              </StyledNavigationItem>
              <StyledNavigationItem>
                <HeaderAccountLink
                  name={user.name}
                  email={user.email}
                  avatarUrl={user.avatarUrl}
                  verified={user.identityVerified}
                />
              </StyledNavigationItem>
              <StyledNavigationItem>
                <form action={signOut}>
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.compact}
                    type="submit"
                    overrides={{
                      BaseButton: { style: { color: "#FFFFFF" } },
                    }}
                  >
                    Déconnexion
                  </Button>
                </form>
              </StyledNavigationItem>
            </>
          ) : (
            <>
              <StyledNavigationItem>
                <Link href="/connexion" className="uber-nav-link">
                  Connexion
                </Link>
              </StyledNavigationItem>
              <StyledNavigationItem>
                <Button
                  kind={KIND.secondary}
                  size={SIZE.compact}
                  onClick={() => router.push("/inscription")}
                >
                  S&apos;inscrire
                </Button>
              </StyledNavigationItem>
            </>
          )}
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.right} className="uber-header-mobile">
          {user ? (
            <StyledNavigationItem>
              <HeaderAccountLink
                name={user.name}
                email={user.email}
                avatarUrl={user.avatarUrl}
                verified={user.identityVerified}
              />
            </StyledNavigationItem>
          ) : null}
          <StyledNavigationItem>
            <Button
              kind={KIND.secondary}
              size={SIZE.compact}
              shape={SHAPE.circle}
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              ≡
            </Button>
          </StyledNavigationItem>
        </StyledNavigationList>
      </HeaderNavigation>

      <Drawer isOpen={open} autoFocus onClose={() => setOpen(false)} anchor={ANCHOR.right}>
        <div className="uber-drawer">
          <BrandLogo variant="dark" />
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/compte" onClick={() => setOpen(false)}>
                Compte
              </Link>
              <form action={signOut}>
                <Button kind={KIND.secondary}>Déconnexion</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/connexion" onClick={() => setOpen(false)}>
                Connexion
              </Link>
              <Button kind={KIND.primary} onClick={() => router.push("/inscription")}>
                S&apos;inscrire
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </div>
  );
}
