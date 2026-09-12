import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { PublishParcelForm } from "@/components/parcels/publish-parcel-form";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import type { ParcelListing, ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Éditer mon colis",
  description: `Modifiez votre annonce de colis sur ${APP_NAME}.`,
};

export default async function EditParcelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=${encodeURIComponent(`/colis/${id}/edit`)}`);
  }

  const { data } = await supabase
    .from("parcel_listings")
    .select(
      "id, user_id, title, description, origin_name, origin_lat, origin_lng, destination_name, dest_lat, dest_lng, parcel_size, weight_kg, is_fragile, estimated_price, distance_km, desired_date, recipient_name, recipient_phone, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const listing = data as ParcelListing;
  if (listing.user_id !== user.id) {
    redirect(`/colis/${id}`);
  }

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-10 lg:py-12">
        <div className="space-y-7 rounded-3xl border border-[#E8E8E8] bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black md:text-3xl dark:text-white">
              Éditer mon colis
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Mettez à jour les détails de votre annonce. Les voyageurs verront
              les changements immédiatement.
            </p>
          </div>
          <Suspense>
            <PublishParcelForm
              listingId={listing.id}
              loggedIn
              defaults={{
                origin: {
                  name: listing.origin_name,
                  lat: Number(listing.origin_lat),
                  lng: Number(listing.origin_lng),
                },
                destination: {
                  name: listing.destination_name,
                  lat: Number(listing.dest_lat),
                  lng: Number(listing.dest_lng),
                },
                size: listing.parcel_size as ParcelSize,
                weight: Number(listing.weight_kg),
                fragile: listing.is_fragile,
                date:
                  listing.desired_date ??
                  new Date().toISOString().slice(0, 10),
                price: listing.estimated_price
                  ? Number(listing.estimated_price)
                  : undefined,
                distance: listing.distance_km
                  ? Number(listing.distance_km)
                  : undefined,
                title: listing.title,
                description: listing.description ?? "",
                recipientName: listing.recipient_name ?? "",
                recipientPhone: listing.recipient_phone ?? "",
              }}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
