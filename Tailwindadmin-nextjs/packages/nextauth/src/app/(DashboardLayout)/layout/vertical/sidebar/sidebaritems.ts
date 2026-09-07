export interface ChildItem {
  id?: string;
  name?: string;
  icon?: string;
  children?: ChildItem[];
  item?: unknown;
  url?: string;
  color?: string;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: string;
  badgeContent?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: string;
  id?: string;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: string;
  disabled?: boolean;
  subtitle?: string;
  badgeType?: string;
  badge?: boolean;
  badgeContent?: string;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "Livre-moi.ca",
    children: [
      {
        name: "Tableau de bord",
        icon: "solar:chart-square-line-duotone",
        id: uniqueId(),
        url: "/",
      },
      {
        name: "Utilisateurs",
        icon: "solar:users-group-rounded-line-duotone",
        id: uniqueId(),
        url: "/users",
      },
      {
        name: "Trajets",
        icon: "solar:map-point-wave-line-duotone",
        id: uniqueId(),
        url: "/trips",
      },
      {
        name: "Réservations",
        icon: "solar:box-minimalistic-line-duotone",
        id: uniqueId(),
        url: "/bookings",
      },
      {
        name: "Tickets / Litiges",
        icon: "solar:ticket-sale-line-duotone",
        id: uniqueId(),
        url: "/tickets",
      },
      {
        name: "Conversations",
        icon: "solar:chat-round-line-line-duotone",
        id: uniqueId(),
        url: "/conversations",
      },
    ],
  },
  {
    heading: "Apps template",
    children: [
      {
        name: "Kanban",
        icon: "solar:clipboard-list-line-duotone",
        id: uniqueId(),
        url: "/apps/kanban",
      },
      {
        name: "Chats",
        icon: "solar:chat-round-dots-line-duotone",
        id: uniqueId(),
        url: "/apps/chats",
      },
      {
        name: "Notes",
        icon: "solar:notes-line-duotone",
        id: uniqueId(),
        url: "/apps/notes",
      },
      {
        name: "Tickets (démo UI)",
        icon: "solar:ticket-line-duotone",
        id: uniqueId(),
        url: "/apps/tickets",
      },
    ],
  },
  {
    heading: "UI",
    children: [
      {
        name: "Tables Shadcn",
        icon: "solar:slider-minimalistic-horizontal-line-duotone",
        id: uniqueId(),
        children: [
          {
            id: uniqueId(),
            name: "Basic",
            icon: "tabler:circle",
            url: "/shadcn-tables/basic",
          },
          {
            id: uniqueId(),
            name: "Hover",
            icon: "tabler:circle",
            url: "/shadcn-tables/hover-table",
          },
          {
            id: uniqueId(),
            name: "Checkbox",
            icon: "tabler:circle",
            url: "/shadcn-tables/checkbox-table",
          },
          {
            id: uniqueId(),
            name: "Striped",
            icon: "tabler:circle",
            url: "/shadcn-tables/striped-row",
          },
        ],
      },
      {
        name: "Cartes / Cards",
        icon: "solar:card-line-duotone",
        id: uniqueId(),
        url: "/widgets/cards",
      },
    ],
  },
];

export default SidebarContent;
