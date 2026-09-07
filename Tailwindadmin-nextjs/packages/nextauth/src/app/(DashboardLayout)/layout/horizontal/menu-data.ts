import { uniqueId } from "lodash";

export interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  href?: string;
  column?: number;
  disabled?: boolean;
  subtitle?: string;
  badge?: boolean;
  badgeType?: "filled" | "outlined";
  children?: MenuItem[];
}

const Menuitems: MenuItem[] = [
  {
    id: uniqueId(),
    title: "Livre-moi",
    icon: "solar:layers-line-duotone",
    href: "",
    column: 1,
    children: [
      { id: uniqueId(), title: "Tableau de bord", href: "/" },
      { id: uniqueId(), title: "Utilisateurs", href: "/users" },
      { id: uniqueId(), title: "Trajets", href: "/trips" },
      { id: uniqueId(), title: "Réservations", href: "/bookings" },
      { id: uniqueId(), title: "Tickets / Litiges", href: "/tickets" },
      { id: uniqueId(), title: "Conversations", href: "/conversations" },
    ],
  },
  {
    id: uniqueId(),
    title: "Apps",
    icon: "solar:widget-line-duotone",
    href: "",
    column: 2,
    children: [
      { id: uniqueId(), title: "Kanban", href: "/apps/kanban" },
      { id: uniqueId(), title: "Chats", href: "/apps/chats" },
      { id: uniqueId(), title: "Notes", href: "/apps/notes" },
      { id: uniqueId(), title: "Tickets démo", href: "/apps/tickets" },
    ],
  },
  {
    id: uniqueId(),
    title: "UI",
    icon: "solar:pallete-2-line-duotone",
    href: "",
    column: 3,
    children: [
      { id: uniqueId(), title: "Tables basic", href: "/shadcn-tables/basic" },
      { id: uniqueId(), title: "Cartes", href: "/widgets/cards" },
    ],
  },
];

export default Menuitems;
