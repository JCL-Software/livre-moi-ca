import { createClient } from "@/lib/supabase/server";
import { TRIP_STATUS_LABELS } from "@/lib/constants";
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

export default async function AdminTrajetsPage() {
  const supabase = await createClient();

  const { data: trips } = await supabase
    .from("trips")
    .select(
      "id, origin_name, destination_name, departure_time, status, available_seats, total_seats, accepts_parcels, price_per_seat, profiles!trips_driver_id_fkey(full_name, email)",
    )
    .order("departure_time", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trajets</h1>
        <p className="text-muted-foreground">
          Tous les trajets publiés sur la plateforme.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des trajets</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Itinéraire</TableHead>
                <TableHead>Conducteur</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Places</TableHead>
                <TableHead>Colis</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(trips ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Aucun trajet publié.
                  </TableCell>
                </TableRow>
              )}
              {(trips ?? []).map((trip) => {
                const driver = Array.isArray(trip.profiles) ? trip.profiles[0] : trip.profiles;

                return (
                  <TableRow key={trip.id}>
                    <TableCell>
                      {trip.origin_name.split(",")[0]} → {trip.destination_name.split(",")[0]}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{driver?.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{driver?.email}</div>
                    </TableCell>
                    <TableCell>
                      {new Date(trip.departure_time).toLocaleString("fr-CA")}
                    </TableCell>
                    <TableCell>
                      {trip.available_seats}/{trip.total_seats} · {Number(trip.price_per_seat).toFixed(0)} $/place
                    </TableCell>
                    <TableCell>{trip.accepts_parcels ? "Oui" : "Non"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {TRIP_STATUS_LABELS[trip.status] ?? trip.status}
                      </Badge>
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
