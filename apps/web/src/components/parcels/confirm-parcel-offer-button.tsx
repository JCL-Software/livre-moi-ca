"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, KIND, SIZE } from "baseui/button";
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
    <Button
      kind={KIND.primary}
      size={SIZE.compact}
      disabled={loading || blocked}
      isLoading={loading}
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
      {price == null ? "Accepter ce tarif" : `Accepter ${formatPrixCad(price)}`}
    </Button>
  );
}
