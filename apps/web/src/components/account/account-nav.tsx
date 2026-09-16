"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "baseui/side-navigation";
import { UberAvatar, UberCard, UberTag } from "@/components/baseweb/uber-ui";
import {
  ACCOUNT_PARCELS_PATH,
  ACCOUNT_PARCELS_TABS,
  accountParcelHref,
} from "@/lib/account-parcels";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  children?: NavItem[];
};

const ACTIVITY: NavItem[] = [
  { href: "/compte", label: "Aperçu", exact: true },
  { href: "/compte/voyages", label: "Voyages" },
  { href: "/compte/trajets", label: "Trajets" },
  {
    href: ACCOUNT_PARCELS_PATH,
    label: "Colis",
    children: [
      { href: ACCOUNT_PARCELS_TABS.annonces.href, label: ACCOUNT_PARCELS_TABS.annonces.navLabel },
      {
        href: ACCOUNT_PARCELS_TABS.transporter.href,
        label: ACCOUNT_PARCELS_TABS.transporter.navLabel,
      },
    ],
  },
  { href: "/compte/messages", label: "Messages" },
  { href: "/compte/notifications", label: "Notifications" },
];

const ACCOUNT: NavItem[] = [
  { href: "/compte/profil", label: "Profil" },
  { href: "/compte/vehicule", label: "Véhicule" },
  { href: "/compte/identite", label: "Identité" },
  { href: "/compte/avis", label: "Avis" },
  { href: "/compte/paiements", label: "Paiements" },
  { href: "/compte/securite", label: "Sécurité" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  const path = href.split("?")[0];
  if (exact) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function flattenNav(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => (item.children ? [item, ...item.children] : [item]));
}

function toNavItems(items: NavItem[], unread: number) {
  return items.map((item) => ({
    title:
      item.href === "/compte/notifications" && unread > 0 ? (
        <span className="flex items-center justify-between gap-2">
          {item.label}
          <UberTag tone="solid">{unread > 9 ? "9+" : unread}</UberTag>
        </span>
      ) : (
        item.label
      ),
    itemId: item.href,
    subNav: item.children ? toNavItems(item.children, unread) : undefined,
  }));
}

export function AccountNav({
  name,
  email,
  avatarUrl,
  verified = false,
  unread,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  verified?: boolean;
  unread: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const onParcels = isActive(pathname, ACCOUNT_PARCELS_PATH);
  const allItems = flattenNav([...ACTIVITY, ...ACCOUNT]);
  const activeItemId = onParcels
    ? accountParcelHref(searchParams.get("onglet"))
    : (allItems.find((item) => isActive(pathname, item.href, item.exact))?.href ?? "/compte");
  const mobileItems = ACTIVITY.flatMap((item) => {
    if (item.children && onParcels) return [item, ...item.children];
    return [item];
  }).concat(ACCOUNT);

  return (
    <>
      <nav aria-label="Espace compte" className="-mx-4 mb-4 overflow-x-auto px-4 pb-1 lg:hidden">
        <div className="flex gap-2">
          {mobileItems.map((item) => {
            const active = item.href.includes("?")
              ? item.href === activeItemId
              : isActive(pathname, item.href, item.exact) &&
                !(item.href === ACCOUNT_PARCELS_PATH && item.children && onParcels);
            const badge = item.href === "/compte/notifications" ? unread : 0;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={
                  active
                    ? "shrink-0 rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white"
                    : "shrink-0 rounded-full bg-[#EEEEEE] px-3 py-1.5 text-sm font-medium text-black"
                }
              >
                {item.label}
                {badge > 0 ? ` ${badge > 9 ? "9+" : badge}` : ""}
              </button>
            );
          })}
        </div>
      </nav>

      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <UberCard>
            <div className="mb-4 flex items-center gap-3">
              <UberAvatar
                name={name || "Mon compte"}
                src={avatarUrl}
                size="40px"
                verified={verified}
              />
              <div className="min-w-0">
                <p className="m-0 truncate text-sm font-semibold text-black">
                  {name || "Mon compte"}
                </p>
                <p className="mt-0.5 mb-0 truncate text-xs text-[#545454]">{email}</p>
              </div>
            </div>
            <p className="uber-home-kicker mb-1">
              Activité
            </p>
            <Navigation
              items={toNavItems(ACTIVITY, unread)}
              activeItemId={activeItemId}
              onChange={({ event, item }) => {
                event.preventDefault();
                if (item.itemId) router.push(item.itemId);
              }}
            />
            <p className="uber-home-kicker mt-5 mb-1">
              Compte
            </p>
            <Navigation
              items={toNavItems(ACCOUNT, unread)}
              activeItemId={activeItemId}
              onChange={({ event, item }) => {
                event.preventDefault();
                if (item.itemId) router.push(item.itemId);
              }}
            />
          </UberCard>
        </div>
      </aside>
    </>
  );
}
