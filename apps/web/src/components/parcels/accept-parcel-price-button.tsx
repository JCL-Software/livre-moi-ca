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

export function AcceptParcelPriceButton({
  listingId,
  conversationId,
  price,
  mode,
}: {
  listingId: string;
  conversationId: string;
  price: number;
  mode: "match" | "counter" | "confirm";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const label = `Accepter ${formatPrixCad(price)}`;

  return (
    <button
      type="button"
      className="btn-brand h-14 w-full disabled:opacity-60"
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
