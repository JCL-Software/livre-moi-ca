export const ACCOUNT_CARPOOL_PATH = "/compte/covoiturage";

export const ACCOUNT_CARPOOL_TABS = {
  voyages: {
    id: "voyages",
    href: `${ACCOUNT_CARPOOL_PATH}?onglet=voyages`,
    navLabel: "Voyages",
    tabLabel: "Mes voyages",
    description: "Demandes de place et envois de colis que vous avez réservés.",
  },
  trajets: {
    id: "trajets",
    href: `${ACCOUNT_CARPOOL_PATH}?onglet=trajets`,
    navLabel: "Trajets",
    tabLabel: "Mes trajets",
    description: "Trajets que vous avez publiés et demandes à accepter.",
  },
} as const;

export type AccountCarpoolTab = keyof typeof ACCOUNT_CARPOOL_TABS;

export function accountCarpoolTab(onglet?: string | null): AccountCarpoolTab {
  return onglet === "trajets" ? "trajets" : "voyages";
}

export function accountCarpoolHref(onglet?: string | null) {
  return ACCOUNT_CARPOOL_TABS[accountCarpoolTab(onglet)].href;
}

export function isAccountCarpoolPath(pathname: string) {
  return (
    pathname === ACCOUNT_CARPOOL_PATH ||
    pathname.startsWith(`${ACCOUNT_CARPOOL_PATH}/`) ||
    pathname === "/compte/voyages" ||
    pathname.startsWith("/compte/voyages/") ||
    pathname === "/compte/trajets" ||
    pathname.startsWith("/compte/trajets/")
  );
}
