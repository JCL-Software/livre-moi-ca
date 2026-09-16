"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  acknowledgeParcelPrice,
  confirmParcelOffer,
  updateParcelOfferPrice,
} from "@/lib/actions/messaging";
import { formatPrixCad } from "@livre-moi/shared/pricing";
import { cn } from "@/lib/utils";

export type TarifChatMode = "match" | "counter" | "confirm";

export function AcceptTarifChatButton({
  listingId,
  conversationId,
  price,
  mode,
  className,
}: {
  listingId: string;
  conversationId: string;
  price: number;
  mode: TarifChatMode;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const label = `J’accepte le tarif de ${formatPrixCad(price)}.`;

  return (
    <button
      type="button"
      className={cn(
        "max-w-[90%] rounded-full bg-black px-4 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-[#222222] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const result =
          mode === "match"
            ? await confirmParcelOffer(listingId, conversationId)
            : mode === "counter"
              ? await updateParcelOfferPrice(listingId, conversationId, price)
              : await acknowledgeParcelPrice(listingId, conversationId);
        setLoading(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(
          mode === "match"
            ? "Tarif accepté. Le transporteur est retenu."
            : mode === "counter"
              ? "Tarif accepté. L’expéditeur peut maintenant vous retenir."
              : "Tarif accepté.",
        );
        router.refresh();
      }}
    >
      {loading ? "Acceptation…" : label}
    </button>
  );
}
