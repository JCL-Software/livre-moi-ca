import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActionResult,
  AppNotification,
  ConversationMessage,
} from "../types";

function shortPlace(name: string) {
  return name.split(",")[0]?.trim() || name;
}

export async function proposeParcelTransportRecord(
  client: SupabaseClient,
  userId: string,
  listingId: string,
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
        .select("id, user_id, title, origin_name, destination_name, status")
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

  const { data: existing } = await client
    .from("conversations")
    .select("id")
    .eq("parcel_listing_id", listingId)
    .eq("initiator_id", userId)
    .maybeSingle();

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

  const driverName = profile.full_name?.trim() || "Un voyageur";
  const route = `${shortPlace(listing.origin_name)} → ${shortPlace(listing.destination_name)}`;
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
    link: `/messages/${conversation.id}`,
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
