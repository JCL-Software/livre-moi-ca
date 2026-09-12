import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ConversationComposer } from "@/components/messages/conversation-composer";
import { createClient } from "@/lib/supabase/server";
import { listConversationMessages } from "@livre-moi/shared/data";

export default async function ConversationPage({
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
    redirect(`/connexion?next=${encodeURIComponent(`/messages/${id}`)}`);
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, parcel_listing_id, initiator_id")
    .eq("id", id)
    .maybeSingle();

  if (!conversation) notFound();

  const { data: listing } = conversation.parcel_listing_id
    ? await supabase
        .from("parcel_listings")
        .select("id, title, origin_name, destination_name, user_id")
        .eq("id", conversation.parcel_listing_id)
        .maybeSingle()
    : { data: null };

  const messages = await listConversationMessages(supabase, id);
  if (!messages.ok) notFound();

  const senderIds = [...new Set(messages.data.map((item) => item.sender_id))];
  const { data: senders } = senderIds.length
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", senderIds)
    : { data: [] };
  const names = new Map(
    (senders ?? []).map((row) => [row.id, row.full_name || "Membre"]),
  );

  return (
    <section className="section-muted">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col gap-6 px-4 py-8 md:py-10">
        <div className="space-y-2">
          <Link
            href={listing ? `/colis/${listing.id}` : "/colis"}
            className="text-sm text-neutral-500 underline-offset-4 hover:underline"
          >
            ← Retour à l&apos;annonce
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            {listing?.title ?? "Conversation"}
          </h1>
          {listing ? (
            <p className="text-sm text-neutral-500">
              {listing.origin_name.split(",")[0]} →{" "}
              {listing.destination_name.split(",")[0]}
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <ul className="flex-1 space-y-3 overflow-y-auto">
            {messages.data.length === 0 ? (
              <li className="text-sm text-neutral-500">Aucun message pour le moment.</li>
            ) : (
              messages.data.map((message) => {
                const mine = message.sender_id === user.id;
                return (
                  <li
                    key={message.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      mine
                        ? "ml-auto bg-black text-white dark:bg-white dark:text-black"
                        : "bg-[#F6F6F6] text-black dark:bg-neutral-800 dark:text-white"
                    }`}
                  >
                    <p className={`mb-1 text-[11px] font-medium ${mine ? "text-white/70 dark:text-black/60" : "text-neutral-500"}`}>
                      {mine ? "Vous" : names.get(message.sender_id) ?? "Membre"}
                    </p>
                    {message.content}
                  </li>
                );
              })
            )}
          </ul>
          <div className="mt-4 border-t border-[#E8E8E8] pt-4 dark:border-white/10">
            <ConversationComposer conversationId={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
