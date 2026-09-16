import { publicStreetName } from "../geo/address";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActionResult,
  AppNotification,
  ConversationMessage,
  ConversationPreview,
  ExistingParcelOffer,
  ParcelListingStatus,
  ParcelTransportOffer,
} from "../types";
import {
  decouperPrixClient,
  formatPrixCad,
  suggestedPriceFromListing,
  validerPrixOffre,
} from "../pricing";

function shortPlace(name: string) {
  return publicStreetName(name);
}

export async function proposeParcelTransportRecord(
  client: SupabaseClient,
  userId: string,
  listingId: string,
  proposedPrice: number,
): Promise<ActionResult<{ conversationId: string; created: boolean }>> {
  const [{ data: profile }, { data: listing, error: listingError }] =
    await Promise.all([
      client
        .from("profiles")
        .select("accepts_parcels, identity_verified, full_name")
        .eq("id", userId)
        .maybeSingle(),
      client
        .from("parcel_listings")
        .select(
          "id, user_id, title, origin_name, destination_name, status, estimated_price, distance_km, weight_kg",
        )
        .eq("id", listingId)
        .maybeSingle(),
    ]);

  if (listingError || !listing) {
    return { ok: false, error: "Cette annonce n'est plus disponible." };
  }
  if (listing.user_id === userId) {
    return {
      ok: false,
      error:
        "Cette annonce est déjà la vôtre. Proposez un transport depuis une autre annonce.",
    };
  }
  if (listing.status !== "OPEN") {
    return { ok: false, error: "Cette annonce n'accepte plus de propositions." };
  }
  if (!profile?.accepts_parcels) {
    return {
      ok: false,
      error:
        "Activez « Accepter des colis » dans les paramètres du compte pour proposer un transport.",
    };
  }
  if (!profile.identity_verified) {
    return {
      ok: false,
      error:
        "Votre identité doit être vérifiée avant de proposer un transport de colis.",
    };
  }

  const suggested = suggestedPriceFromListing(listing);
  const checked = validerPrixOffre(proposedPrice, suggested);
  if (!checked.ok) return { ok: false, error: checked.error };
  const prix = checked.prix;

  const { data: existing } = await client
    .from("conversations")
    .select("id")
    .eq("parcel_listing_id", listingId)
    .eq("initiator_id", userId)
    .maybeSingle();

  const driverName = profile.full_name?.trim() || "Un voyageur";
  const route = `${shortPlace(listing.origin_name)} → ${shortPlace(listing.destination_name)}`;

  if (existing?.id) {
    return {
      ok: true,
      data: { conversationId: existing.id, created: false },
    };
  }

  const { data: conversation, error: conversationError } = await client
    .from("conversations")
    .insert({
      parcel_listing_id: listingId,
      initiator_id: userId,
      proposed_price: prix,
      proposed_by: userId,
      proposed_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (conversationError || !conversation) {
    return {
      ok: false,
      error:
        conversationError?.message ?? "Impossible d'ouvrir la conversation.",
    };
  }

  const intro = `Bonjour, je peux transporter votre colis (${listing.title}) sur ${route}.`;

  const { error: messageError } = await client.from("messages").insert({
    conversation_id: conversation.id,
    sender_id: userId,
    content: intro,
  });
  if (messageError) {
    return { ok: false, error: messageError.message };
  }

  const { error: notificationError } = await client.from("notifications").insert({
    user_id: listing.user_id,
    type: "PARCEL_TRANSPORT_OFFER",
    title: "Proposition de transport",
    body: `${driverName} propose de transporter « ${listing.title} ».`,
    link: `/compte/messages/${conversation.id}`,
    parcel_listing_id: listingId,
    conversation_id: conversation.id,
  });
  if (notificationError) {
    return { ok: false, error: notificationError.message };
  }

  return {
    ok: true,
    data: { conversationId: conversation.id, created: true },
  };
}

async function persistOfferPrice(
  client: SupabaseClient,
  input: {
    conversationId: string;
    listingId: string;
    listingTitle: string;
    actorId: string;
    actorName: string;
    recipientUserId: string;
    prix: number;
    isCounter: boolean;
    accepted?: boolean;
  },
): Promise<ActionResult> {
  const { error: updateError } = await client
    .from("conversations")
    .update({
      proposed_price: input.prix,
      proposed_by: input.actorId,
      proposed_at: new Date().toISOString(),
    })
    .eq("id", input.conversationId);

  if (updateError) return { ok: false, error: updateError.message };

  const content = input.accepted
    ? `J’accepte le tarif de ${formatPrixCad(input.prix)}.`
    : input.isCounter
      ? `Contre-proposition : ${formatPrixCad(input.prix)}.`
      : `Nouveau tarif proposé : ${formatPrixCad(input.prix)}.`;

  const { error: messageError } = await client.from("messages").insert({
    conversation_id: input.conversationId,
    sender_id: input.actorId,
    content,
  });
  if (messageError) return { ok: false, error: messageError.message };

  const { error: notificationError } = await client.from("notifications").insert({
    user_id: input.recipientUserId,
    type: input.accepted
      ? "PARCEL_TRANSPORT_OFFER"
      : input.isCounter
        ? "PARCEL_PRICE_COUNTER"
        : "PARCEL_TRANSPORT_OFFER",
    title: input.accepted
      ? "Tarif accepté"
      : input.isCounter
        ? "Contre-proposition"
        : "Nouveau tarif",
    body: input.accepted
      ? `${input.actorName} accepte ${formatPrixCad(input.prix)} pour « ${input.listingTitle} ».`
      : input.isCounter
        ? `L'expéditeur propose ${formatPrixCad(input.prix)} pour « ${input.listingTitle} ».`
        : `${input.actorName} propose ${formatPrixCad(input.prix)} pour « ${input.listingTitle} ».`,
    link: `/compte/messages/${input.conversationId}?onglet=tarif`,
    parcel_listing_id: input.listingId,
    conversation_id: input.conversationId,
  });
  if (notificationError) return { ok: false, error: notificationError.message };

  return { ok: true, data: null };
}

export async function listConversationMessages(
  client: SupabaseClient,
  conversationId: string,
): Promise<ActionResult<ConversationMessage[]>> {
  const { data, error } = await client
    .from("messages")
    .select("id, conversation_id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as ConversationMessage[] };
}

export async function sendConversationMessageRecord(
  client: SupabaseClient,
  userId: string,
  conversationId: string,
  content: string,
): Promise<ActionResult<{ id: string }>> {
  const trimmed = content.trim();
  if (!trimmed) {
    return { ok: false, error: "Écrivez un message." };
  }

  const { data, error } = await client
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      content: trimmed,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: error?.message ?? "Impossible d'envoyer le message.",
    };
  }

  return { ok: true, data: { id: data.id } };
}

export async function listUserNotifications(
  client: SupabaseClient,
  userId: string,
): Promise<ActionResult<AppNotification[]>> {
  const { data, error } = await client
    .from("notifications")
    .select(
      "id, user_id, type, title, body, link, parcel_listing_id, conversation_id, read_at, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as AppNotification[] };
}

export async function countUnreadNotifications(
  client: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await client
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) return 0;
  return count ?? 0;
}

export async function markNotificationReadRecord(
  client: SupabaseClient,
  userId: string,
  notificationId: string,
): Promise<ActionResult> {
  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

export async function markAllNotificationsReadRecord(
  client: SupabaseClient,
  userId: string,
): Promise<ActionResult> {
  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

type ParcelListingJoin = {
  id: string;
  title: string;
  origin_name: string;
  destination_name: string;
  user_id: string;
  status?: string | null;
  matched_conversation_id?: string | null;
  estimated_price?: number | null;
  agreed_price?: number | null;
  distance_km?: number | null;
  weight_kg?: number | null;
};

type ConversationRow = {
  id: string;
  parcel_listing_id: string | null;
  initiator_id: string | null;
  created_at: string;
  proposed_price?: number | null;
  proposed_by?: string | null;
  parcel_listings: ParcelListingJoin | ParcelListingJoin[] | null;
};

const LISTING_JOIN =
  "id, title, origin_name, destination_name, user_id, status, matched_conversation_id, estimated_price, agreed_price, distance_km, weight_kg";
const CONVERSATION_LISTING_EMBED = `parcel_listings!conversations_parcel_listing_id_fkey ( ${LISTING_JOIN} )`;
const CONVERSATION_OFFER_SELECT = `id, parcel_listing_id, initiator_id, created_at, proposed_price, proposed_by, ${CONVERSATION_LISTING_EMBED}`;

function unwrapJoin<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listUserConversations(
  client: SupabaseClient,
  userId: string,
): Promise<ActionResult<ConversationPreview[]>> {
  const { data, error } = await client
    .from("conversations")
    .select(
      CONVERSATION_OFFER_SELECT,
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { ok: false, error: error.message };

  const rows = (data ?? []) as ConversationRow[];
  if (rows.length === 0) return { ok: true, data: [] };

  const ids = rows.map((row) => row.id);
  const { data: messages } = await client
    .from("messages")
    .select("conversation_id, content, created_at")
    .in("conversation_id", ids)
    .order("created_at", { ascending: false });

  const lastByConversation = new Map<
    string,
    { content: string; created_at: string }
  >();
  for (const message of messages ?? []) {
    if (!lastByConversation.has(message.conversation_id)) {
      lastByConversation.set(message.conversation_id, {
        content: message.content,
        created_at: message.created_at,
      });
    }
  }

  const counterpartIds = new Set<string>();
  for (const row of rows) {
    const listing = unwrapJoin(row.parcel_listings);
    const counterpartId =
      row.initiator_id === userId ? listing?.user_id : row.initiator_id;
    if (counterpartId && counterpartId !== userId) {
      counterpartIds.add(counterpartId);
    }
  }

  const profiles = await profileSnippetsById(client, [...counterpartIds]);

  const previews: ConversationPreview[] = rows.map((row) => {
    const listing = unwrapJoin(row.parcel_listings);
    const counterpartId =
      row.initiator_id === userId ? listing?.user_id : row.initiator_id;
    const last = lastByConversation.get(row.id);
    const origin = listing?.origin_name
      ? shortPlace(listing.origin_name)
      : null;
    const destination = listing?.destination_name
      ? shortPlace(listing.destination_name)
      : null;
    const snippet = counterpartId ? profiles.get(counterpartId) : undefined;

    return {
      id: row.id,
      parcel_listing_id: row.parcel_listing_id,
      initiator_id: row.initiator_id,
      created_at: row.created_at,
      listing_title: listing?.title ?? null,
      listing_route:
        origin && destination ? `${origin} → ${destination}` : null,
      listing_owner_id: listing?.user_id ?? null,
      listing_status: listing?.status ?? null,
      matched_conversation_id: listing?.matched_conversation_id ?? null,
      proposed_price:
        row.proposed_price == null ? null : Number(row.proposed_price),
      proposed_by: row.proposed_by ?? null,
      last_message: last?.content ?? null,
      last_message_at: last?.created_at ?? row.created_at,
      counterpart_id: counterpartId ?? null,
      counterpart_name: snippet?.name ?? "Membre",
      counterpart_avatar_url: snippet?.avatarUrl ?? null,
      counterpart_verified: snippet?.verified ?? false,
    };
  });

  previews.sort((a, b) => {
    const left = a.last_message_at ?? a.created_at;
    const right = b.last_message_at ?? b.created_at;
    return right.localeCompare(left);
  });

  return { ok: true, data: previews };
}

async function lastMessagesByConversation(
  client: SupabaseClient,
  conversationIds: string[],
) {
  const lastByConversation = new Map<
    string,
    { content: string; created_at: string }
  >();
  if (conversationIds.length === 0) return lastByConversation;

  const { data: messages } = await client
    .from("messages")
    .select("conversation_id, content, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });

  for (const message of messages ?? []) {
    if (!lastByConversation.has(message.conversation_id)) {
      lastByConversation.set(message.conversation_id, {
        content: message.content,
        created_at: message.created_at,
      });
    }
  }
  return lastByConversation;
}

type ProfileSnippet = {
  name: string;
  avatarUrl: string | null;
  verified: boolean;
};

async function profileSnippetsById(client: SupabaseClient, ids: string[]) {
  if (ids.length === 0) return new Map<string, ProfileSnippet>();
  const { data: profiles } = await client
    .from("profiles")
    .select("id, full_name, avatar_url, identity_verified")
    .in("id", ids);
  return new Map(
    (profiles ?? []).map((row) => [
      row.id,
      {
        name: row.full_name || "Membre",
        avatarUrl: row.avatar_url ?? null,
        verified: Boolean(row.identity_verified),
      },
    ]),
  );
}

function listingRoute(listing: ParcelListingJoin | null) {
  if (!listing) return "Trajet";
  return `${shortPlace(listing.origin_name)} → ${shortPlace(listing.destination_name)}`;
}

async function mapParcelOffers(
  client: SupabaseClient,
  viewerId: string,
  rows: ConversationRow[],
): Promise<ParcelTransportOffer[]> {
  const lastByConversation = await lastMessagesByConversation(
    client,
    rows.map((row) => row.id),
  );
  const counterpartIds = new Set<string>();
  for (const row of rows) {
    const listing = unwrapJoin(row.parcel_listings);
    const counterpartId =
      row.initiator_id === viewerId ? listing?.user_id : row.initiator_id;
    if (counterpartId && counterpartId !== viewerId) {
      counterpartIds.add(counterpartId);
    }
  }
  const profiles = await profileSnippetsById(client, [...counterpartIds]);

  return rows.flatMap((row) => {
    const listing = unwrapJoin(row.parcel_listings);
    if (!listing || !row.parcel_listing_id || !row.initiator_id) return [];
    const counterpartId =
      row.initiator_id === viewerId ? listing.user_id : row.initiator_id;
    const last = lastByConversation.get(row.id);
    return [
      {
        conversationId: row.id,
        listingId: row.parcel_listing_id,
        listingTitle: listing.title,
        listingRoute: listingRoute(listing),
        listingStatus: (listing.status ?? "OPEN") as ParcelListingStatus,
        matchedConversationId: listing.matched_conversation_id ?? null,
        initiatorId: row.initiator_id,
        counterpartId: counterpartId ?? null,
        counterpartName: counterpartId
          ? (profiles.get(counterpartId)?.name ?? "Membre")
          : "Membre",
        counterpartAvatarUrl: counterpartId
          ? (profiles.get(counterpartId)?.avatarUrl ?? null)
          : null,
        counterpartVerified: counterpartId
          ? Boolean(profiles.get(counterpartId)?.verified)
          : false,
        createdAt: row.created_at,
        lastMessage: last?.content ?? null,
        proposedPrice:
          row.proposed_price == null ? null : Number(row.proposed_price),
        proposedBy: row.proposed_by ?? null,
        suggestedPrice: suggestedPriceFromListing(listing),
        agreedPrice:
          listing.agreed_price == null ? null : Number(listing.agreed_price),
      },
    ];
  });
}

export async function listParcelOffersForListings(
  client: SupabaseClient,
  viewerId: string,
  listingIds: string[],
): Promise<ActionResult<ParcelTransportOffer[]>> {
  if (listingIds.length === 0) return { ok: true, data: [] };

  const { data, error } = await client
    .from("conversations")
    .select(
      CONVERSATION_OFFER_SELECT,
    )
    .in("parcel_listing_id", listingIds)
    .order("created_at", { ascending: false });

  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    data: await mapParcelOffers(client, viewerId, (data ?? []) as ConversationRow[]),
  };
}

export async function listParcelOffersForListing(
  client: SupabaseClient,
  viewerId: string,
  listingId: string,
): Promise<ActionResult<ParcelTransportOffer[]>> {
  return listParcelOffersForListings(client, viewerId, [listingId]);
}

export async function listDriverParcelOffers(
  client: SupabaseClient,
  driverId: string,
): Promise<ActionResult<ParcelTransportOffer[]>> {
  const { data, error } = await client
    .from("conversations")
    .select(CONVERSATION_OFFER_SELECT)
    .eq("initiator_id", driverId)
    .order("created_at", { ascending: false });

  if (error) return { ok: false, error: error.message };
  return {
    ok: true,
    data: await mapParcelOffers(
      client,
      driverId,
      (data ?? []) as ConversationRow[],
    ),
  };
}

export async function getExistingParcelOffer(
  client: SupabaseClient,
  listingId: string,
  userId: string,
): Promise<ExistingParcelOffer | null> {
  const { data } = await client
    .from("conversations")
    .select("id, proposed_price, proposed_by")
    .eq("parcel_listing_id", listingId)
    .eq("initiator_id", userId)
    .maybeSingle();
  if (!data?.id) return null;
  return {
    conversationId: data.id,
    proposedPrice:
      data.proposed_price == null ? null : Number(data.proposed_price),
    proposedBy: data.proposed_by ?? null,
  };
}

export async function updateParcelOfferPriceRecord(
  client: SupabaseClient,
  userId: string,
  listingId: string,
  conversationId: string,
  proposedPrice: number,
): Promise<ActionResult> {
  const [{ data: profile }, { data: listing }, { data: conversation }] =
    await Promise.all([
      client
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle(),
      client
        .from("parcel_listings")
        .select(
          "id, user_id, title, status, estimated_price, distance_km, weight_kg",
        )
        .eq("id", listingId)
        .maybeSingle(),
      client
        .from("conversations")
        .select("id, initiator_id, parcel_listing_id, proposed_price, proposed_by")
        .eq("id", conversationId)
        .maybeSingle(),
    ]);

  if (!listing || listing.status !== "OPEN") {
    return { ok: false, error: "Cette annonce n'accepte plus de propositions." };
  }
  if (
    !conversation ||
    conversation.parcel_listing_id !== listingId ||
    !conversation.initiator_id
  ) {
    return { ok: false, error: "Cette proposition n'est plus disponible." };
  }

  const isDriver = conversation.initiator_id === userId;
  const isOwner = listing.user_id === userId;
  if (!isDriver && !isOwner) {
    return { ok: false, error: "Vous ne pouvez pas modifier ce prix." };
  }

  const checked = validerPrixOffre(
    proposedPrice,
    suggestedPriceFromListing(listing),
  );
  if (!checked.ok) return { ok: false, error: checked.error };

  if (
    conversation.proposed_price != null &&
    Number(conversation.proposed_price) === checked.prix &&
    conversation.proposed_by === userId
  ) {
    return { ok: false, error: "Ce tarif est déjà le vôtre." };
  }

  const accepted =
    conversation.proposed_price != null &&
    Number(conversation.proposed_price) === checked.prix &&
    conversation.proposed_by !== userId;

  const recipientUserId = isOwner ? conversation.initiator_id : listing.user_id;
  const actorName = profile?.full_name?.trim() || (isOwner ? "L'expéditeur" : "Un voyageur");

  return persistOfferPrice(client, {
    conversationId,
    listingId,
    listingTitle: listing.title,
    actorId: userId,
    actorName,
    recipientUserId,
    prix: checked.prix,
    isCounter: isOwner && !accepted,
    accepted,
  });
}

export async function acknowledgeParcelPriceRecord(
  client: SupabaseClient,
  userId: string,
  listingId: string,
  conversationId: string,
): Promise<ActionResult> {
  const [{ data: profile }, { data: listing }, { data: conversation }] =
    await Promise.all([
      client
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle(),
      client
        .from("parcel_listings")
        .select(
          "id, user_id, title, status, estimated_price, distance_km, weight_kg",
        )
        .eq("id", listingId)
        .maybeSingle(),
      client
        .from("conversations")
        .select(
          "id, initiator_id, parcel_listing_id, proposed_price, proposed_by",
        )
        .eq("id", conversationId)
        .maybeSingle(),
    ]);

  if (!listing || listing.status !== "OPEN") {
    return { ok: false, error: "Cette annonce n'accepte plus de propositions." };
  }
  if (
    !conversation ||
    conversation.parcel_listing_id !== listingId ||
    !conversation.initiator_id
  ) {
    return { ok: false, error: "Cette proposition n'est plus disponible." };
  }

  const isDriver = conversation.initiator_id === userId;
  const isOwner = listing.user_id === userId;
  if (!isDriver && !isOwner) {
    return { ok: false, error: "Vous ne pouvez pas accepter ce tarif." };
  }

  const suggested = suggestedPriceFromListing(listing);
  const prix =
    conversation.proposed_price == null
      ? suggested
      : Number(conversation.proposed_price);
  const checked = validerPrixOffre(prix, suggested);
  if (!checked.ok) return { ok: false, error: checked.error };

  const { data: existingMessages } = await client
    .from("messages")
    .select("id, content, sender_id")
    .eq("conversation_id", conversationId)
    .eq("sender_id", userId);

  if (
    (existingMessages ?? []).some((message) =>
      /accepte le tarif/i.test(message.content),
    )
  ) {
    return { ok: false, error: "Vous avez déjà accepté ce tarif." };
  }

  const recipientUserId = isOwner ? conversation.initiator_id : listing.user_id;
  const actorName =
    profile?.full_name?.trim() || (isOwner ? "L'expéditeur" : "Un voyageur");

  const { error: messageError } = await client.from("messages").insert({
    conversation_id: conversationId,
    sender_id: userId,
    content: `J’accepte le tarif de ${formatPrixCad(checked.prix)}.`,
  });
  if (messageError) return { ok: false, error: messageError.message };

  const { error: notificationError } = await client.from("notifications").insert({
    user_id: recipientUserId,
    type: "PARCEL_TRANSPORT_OFFER",
    title: "Tarif accepté",
    body: `${actorName} accepte ${formatPrixCad(checked.prix)} pour « ${listing.title} ».`,
    link: `/compte/messages/${conversationId}?onglet=tarif`,
    parcel_listing_id: listingId,
    conversation_id: conversationId,
  });
  if (notificationError) return { ok: false, error: notificationError.message };

  return { ok: true, data: null };
}

export async function confirmParcelOfferRecord(
  client: SupabaseClient,
  ownerId: string,
  listingId: string,
  conversationId: string,
): Promise<ActionResult> {
  const [{ data: listing }, { data: conversation }] = await Promise.all([
    client
      .from("parcel_listings")
      .select(
        "id, user_id, title, status, estimated_price, distance_km, weight_kg",
      )
      .eq("id", listingId)
      .maybeSingle(),
    client
      .from("conversations")
      .select("id, initiator_id, parcel_listing_id, proposed_price, proposed_by")
      .eq("id", conversationId)
      .maybeSingle(),
  ]);

  if (!listing || listing.user_id !== ownerId) {
    return { ok: false, error: "Vous ne pouvez pas jumeler cette annonce." };
  }
  if (listing.status !== "OPEN") {
    return { ok: false, error: "Cette annonce a déjà un transporteur." };
  }
  if (
    !conversation ||
    conversation.parcel_listing_id !== listingId ||
    !conversation.initiator_id
  ) {
    return { ok: false, error: "Cette proposition n'est plus disponible." };
  }
  if (conversation.proposed_price == null) {
    return {
      ok: false,
      error: "Le voyageur doit d'abord proposer un prix.",
    };
  }
  if (conversation.proposed_by !== conversation.initiator_id) {
    return {
      ok: false,
      error:
        "Attendez que le voyageur accepte votre contre-proposition, ou retenez un prix qu'il a proposé.",
    };
  }

  const checked = validerPrixOffre(
    Number(conversation.proposed_price),
    suggestedPriceFromListing(listing),
  );
  if (!checked.ok) return { ok: false, error: checked.error };
  const split = decouperPrixClient(checked.prix);

  const { error: updateError } = await client
    .from("parcel_listings")
    .update({
      status: "MATCHED",
      matched_conversation_id: conversationId,
      agreed_price: split.prixClient,
      agreed_driver_payout: split.remunerationConducteur,
      agreed_commission: split.commissionPlateforme,
    })
    .eq("id", listingId)
    .eq("user_id", ownerId)
    .eq("status", "OPEN");

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  await client.from("messages").insert({
    conversation_id: conversationId,
    sender_id: ownerId,
    content: `Tarif accepté : ${formatPrixCad(split.prixClient)}. Le transporteur est retenu.`,
  });

  const { data: otherOffers } = await client
    .from("conversations")
    .select("id, initiator_id")
    .eq("parcel_listing_id", listingId);

  const notifications = (otherOffers ?? []).flatMap((offer) => {
    if (!offer.initiator_id || offer.initiator_id === ownerId) return [];
    const chosen = offer.id === conversationId;
    return [
      {
        user_id: offer.initiator_id,
        type: chosen ? "PARCEL_OFFER_ACCEPTED" : "PARCEL_OFFER_DECLINED",
        title: chosen ? "Proposition retenue" : "Colis attribué",
        body: chosen
          ? `L'expéditeur a retenu votre proposition pour « ${listing.title} » à ${formatPrixCad(split.prixClient)}.`
          : `« ${listing.title} » a été attribué à un autre voyageur.`,
        link: chosen ? `/compte/messages/${offer.id}` : `/compte/colis`,
        parcel_listing_id: listingId,
        conversation_id: offer.id,
      },
    ];
  });

  if (notifications.length > 0) {
    await client.from("notifications").insert(notifications);
  }

  return { ok: true, data: null };
}
