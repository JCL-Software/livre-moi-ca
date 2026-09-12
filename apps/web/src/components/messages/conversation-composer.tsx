"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
        className="h-12 flex-1 rounded-xl border border-[#E8E8E8] bg-white px-4 text-sm outline-none focus:border-black dark:border-white/10 dark:bg-neutral-800"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn-brand shrink-0 px-5 disabled:opacity-50"
      >
        {loading ? "…" : "Envoyer"}
      </button>
    </form>
  );
}
