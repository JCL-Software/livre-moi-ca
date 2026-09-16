import Link from "next/link";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountTripCard } from "@/components/account/account-trip-card";
import { requireAccount } from "@/lib/account";

export default async function AccountDriverTripsPage() {
  const { supabase, user } = await requireAccount();
  const { data: myTrips } = await supabase
    .from("trips")
    .select("*, bookings(*)")
    .eq("driver_id", user.id)
    .order("departure_time", { ascending: false });

  return (
    <div>
      <AccountPageHeader
        title="Mes trajets"
        description="Trajets que vous avez publiés et demandes à accepter."
        actions={
          <Link href="/trajets/nouveau" className="btn-brand text-sm">
            Publier un trajet
          </Link>
        }
      />

      {(myTrips ?? []).length === 0 ? (
        <AccountEmpty
          title="Aucun trajet publié"
          description="Publiez un trajet déjà prévu : il sera visible par tous les utilisateurs."
          action={
            <Link href="/trajets/nouveau" className="btn-brand-secondary text-sm">
              Publier un trajet
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {(myTrips ?? []).map((trip) => (
            <AccountTripCard key={trip.id} trip={trip} />
          ))}
        </ul>
      )}
    </div>
  );
}
