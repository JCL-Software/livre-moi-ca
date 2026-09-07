"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { supabase } from "@/app/guards/supabase/supabase-client";

type Stats = {
  users: number;
  trips: number;
  activeTrips: number;
  bookings: number;
  openTickets: number;
  conversations: number;
};

const empty: Stats = {
  users: 0,
  trips: 0,
  activeTrips: 0,
  bookings: 0,
  openTickets: 0,
  conversations: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          users,
          trips,
          activeTrips,
          bookings,
          openTickets,
          conversations,
        ] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("trips").select("id", { count: "exact", head: true }),
          supabase
            .from("trips")
            .select("id", { count: "exact", head: true })
            .in("status", ["SCHEDULED", "ACTIVE"]),
          supabase.from("bookings").select("id", { count: "exact", head: true }),
          supabase
            .from("support_tickets")
            .select("id", { count: "exact", head: true })
            .in("status", ["OPEN", "IN_PROGRESS"]),
          supabase
            .from("conversations")
            .select("id", { count: "exact", head: true }),
        ]);

        const firstError =
          users.error ||
          trips.error ||
          activeTrips.error ||
          bookings.error ||
          openTickets.error ||
          conversations.error;

        if (firstError) throw firstError;

        setStats({
          users: users.count ?? 0,
          trips: trips.count ?? 0,
          activeTrips: activeTrips.count ?? 0,
          bookings: bookings.count ?? 0,
          openTickets: openTickets.count ?? 0,
          conversations: conversations.count ?? 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = [
    { label: "Utilisateurs", value: stats.users, href: "/users" },
    { label: "Trajets", value: stats.trips, href: "/trips" },
    { label: "Trajets actifs", value: stats.activeTrips, href: "/trips" },
    { label: "Réservations", value: stats.bookings, href: "/bookings" },
    { label: "Tickets ouverts", value: stats.openTickets, href: "/tickets" },
    { label: "Conversations", value: stats.conversations, href: "/conversations" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-sm text-darklink">
          Vue d&apos;ensemble Livre-moi.ca (Abitibi ↔ corridor)
        </p>
      </div>

      {error ? (
        <Card className="p-4 text-sm text-error">{error}</Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="p-5 transition hover:border-primary">
              <p className="text-sm text-darklink">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold">
                {loading ? "…" : card.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
