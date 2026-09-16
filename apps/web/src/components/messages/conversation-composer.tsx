"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ACCOUNT_FIELD } from "@/components/account/account-ui";
import { sendConversationMessage } from "@/lib/actions/messaging";

export function ConversationComposer({
  conversationId,
}: {
  conversationId: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = content.trim();
    if (!next) return;
    setLoading(true);
    const result = await sendConversationMessage(conversationId, next);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Votre message…"
        className={`${ACCOUNT_FIELD} h-14 flex-1`}
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn-brand h-14 shrink-0 px-5 py-0 disabled:opacity-50"
      >
        {loading ? "…" : "Envoyer"}
      </button>
    </form>
  );
}
