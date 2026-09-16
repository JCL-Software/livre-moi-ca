"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { confirmParcelOffer } from "@/lib/actions/messaging";
import { formatPrixCad } from "@livre-moi/shared/pricing";

export function ConfirmParcelOfferButton({
  listingId,
  conversationId,
  price,
  disabled,
}: {
  listingId: string;
  conversationId: string;
  price: number | null;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const blocked = disabled || price == null;

  return (
    <button
      type="button"
      className="btn-brand h-9 px-3 py-0 text-sm disabled:opacity-50"
      disabled={loading || blocked}
      onClick={async () => {
        if (blocked) return;
        setLoading(true);
        const result = await confirmParcelOffer(listingId, conversationId);
        setLoading(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Tarif accepté. Le transporteur est retenu.");
        router.refresh();
      }}
    >
      {loading
        ? "Confirmation…"
        : price == null
          ? "Accepter ce tarif"
          : `Accepter ${formatPrixCad(price)}`}
    </button>
  );
}
