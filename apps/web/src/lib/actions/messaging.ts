"use server";

import { redirect } from "next/navigation";
import { revalidateAccount } from "@/lib/revalidate";
import { createClient } from "@/lib/supabase/server";
import {
  acknowledgeParcelPriceRecord,
  confirmParcelOfferRecord,
  listConversationMessages,
  listUserNotifications,
  markAllNotificationsReadRecord,
  markNotificationReadRecord,
  proposeParcelTransportRecord,
  sendConversationMessageRecord,
  updateParcelOfferPriceRecord,
} from "@livre-moi/shared/data";
import type {
  ActionResult,
  AppNotification,
  ConversationMessage,
} from "@livre-moi/shared";

export async function proposeParcelTransport(
  listingId: string,
  proposedPrice: number,
): Promise<ActionResult<{ conversationId: string; created: boolean }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connectez-vous pour proposer un transport." };
  }

  const result = await proposeParcelTransportRecord(
    supabase,
    user.id,
    listingId,
    proposedPrice,
  );
  if (!result.ok) return result;

  revalidateAccount([`/colis/${listingId}`, `/compte/messages/${result.data.conversationId}`]);
  return {
    ok: true,
    data: {
      conversationId: result.data.conversationId,
      created: result.data.created,
    },
  };
}

export async function updateParcelOfferPrice(
  listingId: string,
  conversationId: string,
  proposedPrice: number,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connectez-vous pour modifier le prix." };
  }

  const result = await updateParcelOfferPriceRecord(
    supabase,
    user.id,
    listingId,
    conversationId,
    proposedPrice,
  );
  if (result.ok) {
    revalidateAccount([
      `/colis/${listingId}`,
      `/compte/messages/${conversationId}`,
    ]);
  }
  return result;
}

export async function confirmParcelOffer(
  listingId: string,
  conversationId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connectez-vous pour retenir un conducteur." };
  }

  const result = await confirmParcelOfferRecord(
    supabase,
    user.id,
    listingId,
    conversationId,
  );
  if (result.ok) {
    revalidateAccount([
      `/colis/${listingId}`,
      `/compte/messages/${conversationId}`,
    ]);
  }
  return result;
}

export async function acknowledgeParcelPrice(
  listingId: string,
  conversationId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connectez-vous pour accepter ce tarif." };
  }

  const result = await acknowledgeParcelPriceRecord(
    supabase,
    user.id,
    listingId,
    conversationId,
  );
  if (result.ok) {
    revalidateAccount([
      `/colis/${listingId}`,
      `/compte/messages/${conversationId}`,
    ]);
  }
  return result;
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ActionResult<ConversationMessage[]>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };
  return listConversationMessages(supabase, conversationId);
}

export async function sendConversationMessage(
  conversationId: string,
  content: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const result = await sendConversationMessageRecord(
    supabase,
    user.id,
    conversationId,
    content,
  );
  if (result.ok) {
    revalidateAccount([`/compte/messages/${conversationId}`]);
  }
  return result;
}

export async function getMyNotifications(): Promise<
  ActionResult<AppNotification[]>
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };
  return listUserNotifications(supabase, user.id);
}

export async function openNotification(notificationId: string, link: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion");
  }
  await markNotificationReadRecord(supabase, user.id, notificationId);
  revalidateAccount();
  redirect(link || "/compte/notifications");
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const result = await markAllNotificationsReadRecord(supabase, user.id);
  if (result.ok) revalidateAccount();
  return result;
}
