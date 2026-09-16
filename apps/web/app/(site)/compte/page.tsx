import Link from "next/link";
import { AccountEmpty } from "@/components/account/account-empty";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { AccountStatCard } from "@/components/account/account-stat-card";
import { UberCard, UberCardLink, UberTag } from "@/components/baseweb/uber-ui";
import { requireAccount } from "@/lib/account";
import { formatDateTime, shortPlace } from "@/lib/account-format";
import { BOOKING_STATUS_LABELS } from "@/lib/constants";
import { countUnreadNotifications, listUserConversations } from "@livre-moi/shared/data";
import { UberButtonLink, KIND, SIZE } from "@/components/baseweb/uber-button-link";

export default async function AccountHomePage() {
  const { supabase, user, profile } = await requireAccount();

  const [
    { data: myBookings },
    { data: myTrips },
    { data: myParcels },
    conversations,
    unread,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, status, booking_type, parcel_title, created_at, trips(origin_name, destination_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("trips")
      .select("id, status, departure_time")
      .eq("driver_id", user.id)
      .order("departure_time", { ascending: false }),
    supabase
      .from("parcel_listings")
      .select("id, status")
      .eq("user_id", user.id),
    listUserConversations(supabase, user.id),
    countUnreadNotifications(supabase, user.id),
  ]);

  const activeBookings = (myBookings ?? []).filter((row) =>
    ["PENDING", "CONFIRMED", "PICKED_UP"].includes(row.status),
  ).length;
  const upcomingTrips = (myTrips ?? []).filter((row) => row.status === "SCHEDULED").length;
  const openParcels = (myParcels ?? []).filter((row) => row.status === "OPEN").length;
  const conversationCount = conversations.ok ? conversations.data.length : 0;
  const recentBookings = (myBookings ?? []).slice(0, 3);
  const recentConversations = conversations.ok ? conversations.data.slice(0, 3) : [];

  const profileReady = Boolean(profile?.full_name && profile?.phone);
  const driverReady = Boolean(profile?.is_driver && profile?.vehicle_model);
  const canCarryParcels = Boolean(profile?.accepts_parcels && profile?.identity_verified);

  return (
    <div>
      <AccountPageHeader
        title={`Bonjour${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}`}
        description="Suivez vos demandes, vos trajets et les informations de votre compte."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AccountStatCard label="Voyages en cours" value={activeBookings} href="/compte/voyages" />
        <AccountStatCard label="Trajets à venir" value={upcomingTrips} href="/compte/trajets" />
        <AccountStatCard label="Colis ouverts" value={openParcels} href="/compte/colis" />
        <AccountStatCard
          label="Messages"
          value={conversationCount}
          href="/compte/messages"
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Link href="/recherche" className="block no-underline">
          <UberCard>
            <p className="m-0 text-sm font-medium text-black">Rechercher un trajet</p>
          </UberCard>
        </Link>
        <Link href="/colis/nouveau" className="block no-underline">
          <UberCard>
            <p className="m-0 text-sm font-medium text-black">Publier un colis</p>
          </UberCard>
        </Link>
        <Link href="/trajets/nouveau" className="block no-underline">
          <UberCard>
            <p className="m-0 text-sm font-medium text-black">Publier un trajet</p>
          </UberCard>
        </Link>
      </div>

      {(!profileReady || !profile?.identity_verified || (profile?.is_driver && !driverReady) || unread > 0) && (
        <div className="mt-6 space-y-3">
          {!profileReady ? (
            <Link href="/compte/profil" className="block no-underline">
              <UberCard>
                <p className="m-0 text-sm">
                  Complétez votre profil (nom et téléphone) pour rassurer la communauté.
                </p>
              </UberCard>
            </Link>
          ) : null}
          {!profile?.identity_verified ? (
            <Link href="/compte/identite" className="block no-underline">
              <UberCard>
                <p className="m-0 text-sm">
                  Vérifiez votre identité pour proposer un transport de colis.
                </p>
              </UberCard>
            </Link>
          ) : null}
          {profile?.is_driver && !driverReady ? (
            <Link href="/compte/vehicule" className="block no-underline">
              <UberCard>
                <p className="m-0 text-sm">
                  Ajoutez le modèle de votre véhicule avant d&apos;accueillir des passagers.
                </p>
              </UberCard>
            </Link>
          ) : null}
          {profile && !canCarryParcels && profile.identity_verified ? (
            <Link href="/compte/vehicule" className="block no-underline">
              <UberCard>
                <p className="m-0 text-sm">
                  Activez « Accepter des colis » pour proposer un transport.
                </p>
              </UberCard>
            </Link>
          ) : null}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dernières demandes</h2>
            <Link
              href="/compte/voyages"
              className="text-sm font-medium text-[#545454] underline-offset-4 hover:text-black hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <AccountEmpty
              title="Aucune demande"
              description="Réservez une place ou publiez un colis pour commencer."
              action={
                <UberButtonLink href="/recherche" kind={KIND.secondary} size={SIZE.compact}>
                  Rechercher
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {recentBookings.map((booking) => {
                const trip = Array.isArray(booking.trips) ? booking.trips[0] : booking.trips;
                return (
                  <li key={booking.id}>
                    <UberCardLink href={`/compte/voyages/${booking.id}`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="m-0 text-sm font-medium">
                          {shortPlace(trip?.origin_name)} → {shortPlace(trip?.destination_name)}
                        </p>
                        <UberTag>{BOOKING_STATUS_LABELS[booking.status] ?? booking.status}</UberTag>
                      </div>
                      <p className="mt-1 mb-0 text-xs text-[#545454]">
                        {booking.booking_type === "PARCEL"
                          ? booking.parcel_title ?? "Colis"
                          : "Place passager"}{" "}
                        · {formatDateTime(booking.created_at)}
                      </p>
                    </UberCardLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages récents</h2>
            <Link
              href="/compte/messages"
              className="text-sm font-medium text-[#545454] underline-offset-4 hover:text-black hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentConversations.length === 0 ? (
            <AccountEmpty
              title="Aucune conversation"
              description="Les propositions de transport apparaissent ici."
              action={
                <UberButtonLink href="/colis" kind={KIND.secondary} size={SIZE.compact}>
                  Voir les colis
                </UberButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {recentConversations.map((item) => (
                <li key={item.id}>
                  <UberCardLink href={`/compte/messages/${item.id}`}>
                    <p className="m-0 text-sm font-medium text-black">
                      {item.listing_title ?? "Conversation"}
                    </p>
                    <p className="mt-1 mb-0 truncate text-xs text-[#545454]">
                      {item.counterpart_name}
                      {item.last_message ? ` · ${item.last_message}` : ""}
                    </p>
                  </UberCardLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
