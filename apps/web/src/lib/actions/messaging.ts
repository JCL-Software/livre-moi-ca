"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  listConversationMessages,
  listUserNotifications,
  markNotificationReadRecord,
  proposeParcelTransportRecord,
  sendConversationMessageRecord,
} from "@livre-moi/shared/data";
import type {
  ActionResult,
  AppNotification,
  ConversationMessage,
} from "@livre-moi/shared";

export async function proposeParcelTransport(
  listingId: string,
): Promise<ActionResult<{ conversationId: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Connectez-vous pour proposer un transport." };
  }

  const result = await proposeParcelTransportRecord(supabase, user.id, listingId);
  if (!result.ok) return result;

  revalidatePath("/notifications");
  revalidatePath(`/colis/${listingId}`);
  revalidatePath(`/messages/${result.data.conversationId}`);
  return {
    ok: true,
    data: { conversationId: result.data.conversationId },
  };
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
    revalidatePath(`/messages/${conversationId}`);
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
  revalidatePath("/notifications");
  redirect(link || "/notifications");
}
