import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { SiteBackLink, SitePage } from "@/components/layout/site-page";
import { UberPageIntro } from "@/components/baseweb/uber-page-intro";
import { PublishParcelForm } from "@/components/parcels/publish-parcel-form";
import { createClient } from "@/lib/supabase/server";
import { getParcelDeliveryDetails } from "@livre-moi/shared/data";
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
      "id, user_id, title, description, origin_name, origin_lat, origin_lng, destination_name, dest_lat, dest_lng, parcel_size, category, category_detail, weight_kg, is_fragile, estimated_price, distance_km, desired_date, photo_url, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const listing = data as ParcelListing;
  if (listing.user_id !== user.id) {
    redirect(`/colis/${id}`);
  }

  const details = await getParcelDeliveryDetails(supabase, listing.id);

  return (
    <SitePage>
      <SiteBackLink href="/compte/colis">Mes colis</SiteBackLink>
      <UberPageIntro
        kicker="Livraison collaborative"
        title="Éditer mon colis"
        subtitle="Mettez à jour les détails de votre annonce. Les changements sont visibles immédiatement par tous les utilisateurs."
      />
      <div className="mt-6">
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
              category: listing.category ?? "PARCEL",
              categoryDetail: listing.category_detail ?? "",
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
              originUnit: details?.origin_unit ?? "",
              destUnit: details?.dest_unit ?? "",
              destAddress: details?.dest_address ?? "",
              recipientFirstName: details?.recipient_first_name ?? "",
              recipientLastName: details?.recipient_last_name ?? "",
              recipientPhone: details?.recipient_phone ?? "",
              meetingPoint: details?.meeting_point ?? "",
              photoUrl: listing.photo_url ?? null,
            }}
          />
        </Suspense>
      </div>
    </SitePage>
  );
}
