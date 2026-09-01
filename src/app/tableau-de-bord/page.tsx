import { createClient } from "@/lib/supabase/server";
import { seedDemoTrips } from "@/lib/actions/trips";
import { BookingActions } from "@/components/dashboard/booking-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOOKING_STATUS_LABELS, TRIP_STATUS_LABELS } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: myTrips }, { data: myBookings }, { data: secrets }] = await Promise.all([
    supabase
      .from("trips")
      .select("*, bookings(*)")
      .eq("driver_id", user!.id)
      .order("departure_time", { ascending: false }),
    supabase
      .from("bookings")
      .select("*, trips(*)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase.from("booking_secrets").select("booking_id, otp_code").eq("sender_id", user!.id),
  ]);

  const otpByBooking = new Map((secrets ?? []).map((row) => [row.booking_id, row.otp_code]));

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Espace</p>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Vos trajets, réservations et livraisons.</p>
        </div>
        <form action={async () => { "use server"; await seedDemoTrips(); }}>
          <Button type="submit" variant="outline">
            Générer 3 trajets démo
          </Button>
        </form>
      </div>

      <Tabs defaultValue="voyages">
        <TabsList>
          <TabsTrigger value="voyages">Mes voyages</TabsTrigger>
          <TabsTrigger value="trajets">Mes trajets (conducteur)</TabsTrigger>
        </TabsList>

        <TabsContent value="voyages" className="space-y-3 pt-4">
          {(myBookings ?? []).length === 0 && (
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                Aucune réservation pour le moment.
              </CardContent>
            </Card>
          )}
          {(myBookings ?? []).map((booking) => {
            const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
            const otp = otpByBooking.get(booking.id);
            return (
              <Card key={booking.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-base">
                    {trip?.origin_name?.split(",")[0]} → {trip?.destination_name?.split(",")[0]}
                  </CardTitle>
                  <Badge variant="secondary">
                    {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    {booking.booking_type === "PARCEL"
                      ? `Colis : ${booking.parcel_title ?? "sans titre"}`
                      : `${booking.seats_booked} place(s)`}{" "}
                    · {Number(booking.total_price).toFixed(2)} $
                  </p>
                  {otp && booking.status !== "DELIVERED" && (
                    <p className="rounded-md bg-muted px-3 py-2 font-mono text-base">
                      Code destinataire : {otp}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="trajets" className="space-y-3 pt-4">
          {(myTrips ?? []).length === 0 && (
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                Vous n&apos;avez pas encore publié de trajet.
              </CardContent>
            </Card>
          )}
          {(myTrips ?? []).map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {trip.origin_name.split(",")[0]} → {trip.destination_name.split(",")[0]}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date(trip.departure_time).toLocaleString("fr-CA")} ·{" "}
                  {TRIP_STATUS_LABELS[trip.status]}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {(trip.bookings ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune demande pour l&apos;instant.</p>
                )}
                {(trip.bookings ?? []).map((booking: {
                  id: string;
                  status: BookingStatus;
                  booking_type: "PASSENGER" | "PARCEL";
                  parcel_title: string | null;
                  seats_booked: number;
                  recipient_name: string | null;
                }) => (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-2 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="text-sm">
                      <p className="font-medium">
                        {booking.booking_type === "PARCEL"
                          ? booking.parcel_title ?? "Colis"
                          : `${booking.seats_booked} passager(s)`}
                      </p>
                      {booking.recipient_name && (
                        <p className="text-muted-foreground">Pour {booking.recipient_name}</p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </Badge>
                    </div>
                    <BookingActions
                      bookingId={booking.id}
                      status={booking.status}
                      bookingType={booking.booking_type}
                      role="driver"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
