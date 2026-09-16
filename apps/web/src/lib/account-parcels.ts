export const ACCOUNT_PARCELS_PATH = "/compte/colis";

export const ACCOUNT_PARCELS_TABS = {
  annonces: {
    id: "annonces",
    href: `${ACCOUNT_PARCELS_PATH}?onglet=annonces`,
    navLabel: "Annonces",
    tabLabel: "Annonces publiées",
    description: "Colis que vous faites transporter par quelqu’un déjà en route.",
  },
  transporter: {
    id: "transporter",
    href: `${ACCOUNT_PARCELS_PATH}?onglet=transporter`,
    navLabel: "À transporter",
    tabLabel: "Colis à transporter",
    description: "Colis que vous avez proposé de livrer sur un trajet déjà prévu.",
  },
} as const;

export type AccountParcelTab = keyof typeof ACCOUNT_PARCELS_TABS;

export function accountParcelTab(onglet?: string | null): AccountParcelTab {
  return onglet === "transporter" ? "transporter" : "annonces";
}

export function accountParcelHref(onglet?: string | null) {
  return ACCOUNT_PARCELS_TABS[accountParcelTab(onglet)].href;
}
