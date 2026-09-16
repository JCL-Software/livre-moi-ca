import { notFound } from "next/navigation";
import { ConversationHeader } from "@/components/messages/conversation-header";
import { ConversationTarifPanel } from "@/components/messages/conversation-tarif-panel";
import { ConversationThread } from "@/components/messages/conversation-thread";
import { ParcelDeliveryPrivate } from "@/components/parcels/parcel-delivery-private";
import { memberProfileHref } from "@/components/account/account-ui";
import { requireAccount } from "@/lib/account";
import { shortPlace } from "@/lib/account-format";
import { getParcelDeliveryDetails, listConversationMessages } from "@livre-moi/shared/data";
import { suggestedPriceFromListing } from "@livre-moi/shared/pricing";

export default async function AccountConversationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { id } = await params;
  const { onglet } = await searchParams;
  const { supabase, user } = await requireAccount();
  const tarifTab = onglet === "tarif";

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, parcel_listing_id, initiator_id, proposed_price, proposed_by")
    .eq("id", id)
    .maybeSingle();

  if (!conversation) notFound();

  const { data: listing } = conversation.parcel_listing_id
    ? await supabase
        .from("parcel_listings")
        .select(
          "id, title, origin_name, destination_name, user_id, status, estimated_price, distance_km, weight_kg, agreed_price",
        )
        .eq("id", conversation.parcel_listing_id)
        .maybeSingle()
    : { data: null };

  const messages = await listConversationMessages(supabase, id);
  if (!messages.ok) notFound();

  const senderIds = [...new Set(messages.data.map((item) => item.sender_id))];
  const counterpartId = listing
    ? listing.user_id === user.id
      ? conversation.initiator_id
      : listing.user_id
    : conversation.initiator_id === user.id
      ? null
      : conversation.initiator_id;
  if (counterpartId) senderIds.push(counterpartId);
  const { data: senders } = senderIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, identity_verified")
        .in("id", [...new Set(senderIds)])
    : { data: [] };
  const people = Object.fromEntries(
    (senders ?? []).map((row) => [
      row.id,
      {
        name: row.full_name || "Membre",
        avatarUrl: row.avatar_url ?? null,
        verified: Boolean(row.identity_verified),
      },
    ]),
  );
  const counterpartName = counterpartId
    ? (people[counterpartId]?.name ?? "Membre")
    : null;
  const isOwner = Boolean(listing && listing.user_id === user.id);
  const isDriver = conversation.initiator_id === user.id;
  const listingOpen = listing?.status === "OPEN";
  const suggested = listing ? suggestedPriceFromListing(listing) : null;
  const priceAcknowledged = messages.data.some(
    (message) =>
      message.sender_id === user.id && /accepte le tarif/i.test(message.content),
  );
  const counterpartAcknowledged = messages.data.some(
    (message) =>
      message.sender_id !== user.id && /accepte le tarif/i.test(message.content),
  );
  const showTarifNav = Boolean(listing && suggested != null);
  const tarifHref = `/compte/messages/${id}?onglet=tarif`;
  const messagesHref = `/compte/messages/${id}`;
  const route = listing
    ? `${shortPlace(listing.origin_name)} → ${shortPlace(listing.destination_name)}`
    : null;
  const deliveryDetails = listing
    ? await getParcelDeliveryDetails(supabase, listing.id)
    : null;

  const currentPrice =
    listing?.agreed_price != null
      ? Number(listing.agreed_price)
      : conversation.proposed_price != null
        ? Number(conversation.proposed_price)
        : (suggested ?? null);
  const proposedByInitiator =
    conversation.proposed_by === conversation.initiator_id;
  const ownerCanMatch =
    Boolean(listingOpen && isOwner && proposedByInitiator && currentPrice != null) &&
    listing?.agreed_price == null;
  const driverCanAcceptCounter =
    Boolean(
      listingOpen &&
        isDriver &&
        !proposedByInitiator &&
        conversation.proposed_price != null,
    ) && listing?.agreed_price == null;
  const canConfirmDisplayed =
    Boolean(listingOpen && !priceAcknowledged && isDriver && proposedByInitiator) &&
    listing?.agreed_price == null;

  let tarifAction: {
    listingId: string;
    conversationId: string;
    price: number;
    mode: "match" | "counter" | "confirm";
    hint: string;
  } | null = null;

  if (listing && currentPrice != null && listing.agreed_price == null) {
    if (ownerCanMatch) {
      tarifAction = {
        listingId: listing.id,
        conversationId: conversation.id,
        price: currentPrice,
        mode: "match",
        hint: counterpartAcknowledged
          ? "Le voyageur a accepté ce tarif. Confirmez pour retenir le transporteur."
          : "Acceptez ce tarif pour retenir le transporteur.",
      };
    } else if (driverCanAcceptCounter) {
      tarifAction = {
        listingId: listing.id,
        conversationId: conversation.id,
        price: currentPrice,
        mode: "counter",
        hint: "L’expéditeur propose ce tarif. Acceptez-le pour continuer.",
      };
    } else if (canConfirmDisplayed) {
      tarifAction = {
        listingId: listing.id,
        conversationId: conversation.id,
        price: currentPrice,
        mode: "confirm",
        hint: "Acceptez le tarif affiché pour que l’expéditeur puisse vous retenir.",
      };
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-5">
      <ConversationHeader
        title={listing?.title ?? "Conversation"}
        route={route}
        listingHref={listing ? `/colis/${listing.id}` : null}
        listingStatus={listing?.status ?? null}
        counterpartName={counterpartName}
        counterpartAvatarUrl={counterpartId ? people[counterpartId]?.avatarUrl : null}
        counterpartVerified={counterpartId ? Boolean(people[counterpartId]?.verified) : false}
        counterpartProfileHref={counterpartId ? memberProfileHref(counterpartId) : null}
        messagesHref={messagesHref}
        tarifHref={tarifHref}
        tarifTab={tarifTab}
        showTarifNav={showTarifNav}
        listingOpen={listingOpen}
      />

      {deliveryDetails && listing ? (
        <ParcelDeliveryPrivate
          details={deliveryDetails}
          originName={listing.origin_name}
          destinationName={listing.destination_name}
        />
      ) : null}

      {showTarifNav && tarifTab && listing && suggested != null ? (
        <ConversationTarifPanel
          listingId={listing.id}
          conversationId={conversation.id}
          suggestedPrice={suggested}
          proposedPrice={
            conversation.proposed_price == null
              ? null
              : Number(conversation.proposed_price)
          }
          proposedByInitiator={
            conversation.proposed_by === conversation.initiator_id
          }
          agreedPrice={
            listing.agreed_price == null ? null : Number(listing.agreed_price)
          }
          listingOpen={listingOpen}
          isOwner={isOwner}
          isDriver={isDriver}
          priceAcknowledged={priceAcknowledged}
          counterpartAcknowledged={counterpartAcknowledged}
        />
      ) : (
        <ConversationThread
          conversationId={id}
          messages={messages.data}
          userId={user.id}
          people={people}
          tarifAction={tarifTab ? null : tarifAction}
          tarifHref={showTarifNav ? tarifHref : null}
        />
      )}
    </div>
  );
}
