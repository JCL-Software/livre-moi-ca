import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import AdminWelcome from "@/components/admin/dashboard/AdminWelcome";
import { AdminQuickStats } from "@/components/admin/dashboard/AdminQuickStats";
import SalesOverview from "@/components/admin/dashboard/SalesOverview";
import { RecentTransaction } from "@/components/admin/dashboard/RecentTransaction";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const [
    { count: tripsCount },
    { count: bookingsCount },
    { count: pendingBookingsCount },
    { count: usersCount },
  ] = await Promise.all([
    supabase.from("trips").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      key: "trips",
      title: "Trajets publiés",
      value: String(tripsCount ?? 0),
      href: "/admin/trajets",
      bgcolor: "bg-lightprimary",
      textclr: "text-primary",
    },
    {
      key: "bookings",
      title: "Réservations",
      value: String(bookingsCount ?? 0),
      href: "/admin/reservations",
      bgcolor: "bg-lightsuccess",
      textclr: "text-success",
    },
    {
      key: "pending",
      title: "En attente",
      value: String(pendingBookingsCount ?? 0),
      href: "/admin/reservations?status=PENDING",
      bgcolor: "bg-lightwarning",
      textclr: "text-warning",
    },
    {
      key: "users",
      title: "Utilisateurs",
      value: String(usersCount ?? 0),
      href: "/admin/utilisateurs",
      bgcolor: "bg-lightsecondary",
      textclr: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <AdminWelcome fullName={admin.fullName} />
      </div>
      <div className="col-span-12">
        <AdminQuickStats items={stats} />
      </div>
      <div className="col-span-12 lg:col-span-8">
        <SalesOverview />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <RecentTransaction />
      </div>
    </div>
  );
}
