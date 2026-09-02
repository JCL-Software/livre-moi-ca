import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select("id, status, booking_type, total_price, created_at, parcel_title, seats_booked, trips(origin_name, destination_name), profiles!bookings_user_id_fkey(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: bookings } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Réservations</h1>
        <p className="text-muted-foreground">
          Modération des demandes colis et covoiturage.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["", "PENDING", "CONFIRMED", "PICKED_UP", "DELIVERED", "CANCELLED"].map((value) => (
          <Link
            key={value || "all"}
            href={value ? `/admin/reservations?status=${value}` : "/admin/reservations"}
            className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
              (status ?? "") === value
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-muted text-muted-foreground ring-border"
            }`}
          >
            {value ? (BOOKING_STATUS_LABELS[value] ?? value) : "Toutes"}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trajet</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(bookings ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucune réservation trouvée.
                  </TableCell>
                </TableRow>
              )}
              {(bookings ?? []).map((booking) => {
                const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
                const profile = Array.isArray(booking.profiles)
                  ? booking.profiles[0]
                  : booking.profiles;

                return (
                  <TableRow key={booking.id}>
                    <TableCell>
                      {trip?.origin_name?.split(",")[0]} → {trip?.destination_name?.split(",")[0]}
                    </TableCell>
                    <TableCell>
                      {booking.booking_type === "PARCEL"
                        ? booking.parcel_title ?? "Colis"
                        : `${booking.seats_booked} place(s)`}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{profile?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{profile?.email}</div>
                    </TableCell>
                    <TableCell>{Number(booking.total_price).toFixed(2)} $</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(booking.created_at).toLocaleString("fr-CA")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
