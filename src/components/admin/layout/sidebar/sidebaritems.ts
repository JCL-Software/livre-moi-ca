export interface AdminSidebarItem {
  heading?: string;
  id?: string;
  name?: string;
  icon?: string;
  url?: string;
  children?: AdminSidebarItem[];
}

const adminSidebarItems: AdminSidebarItem[] = [
  {
    heading: "Administration",
    children: [
      {
        id: "dashboard",
        name: "Tableau de bord",
        icon: "solar:widget-2-linear",
        url: "/admin",
      },
      {
        id: "trips",
        name: "Trajets",
        icon: "solar:map-point-linear",
        url: "/admin/trajets",
      },
      {
        id: "bookings",
        name: "Réservations",
        icon: "solar:box-linear",
        url: "/admin/reservations",
      },
      {
        id: "users",
        name: "Utilisateurs",
        icon: "solar:users-group-rounded-linear",
        url: "/admin/utilisateurs",
      },
    ],
  },
  {
    heading: "Liens",
    children: [
      {
        id: "site",
        name: "Retour au site",
        icon: "solar:home-2-linear",
        url: "/",
      },
      {
        id: "dashboard-user",
        name: "Mon espace",
        icon: "solar:user-circle-linear",
        url: "/tableau-de-bord",
      },
    ],
  },
];

export default adminSidebarItems;
