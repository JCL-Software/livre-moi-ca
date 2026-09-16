"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ACCOUNT_FIELD,
  AccountFieldLabel,
} from "@/components/account/account-ui";
import {
  proposeParcelTransport,
  updateParcelOfferPrice,
} from "@/lib/actions/messaging";
import { bornesPrixOffre, formatPrixCad } from "@livre-moi/shared/pricing";

export function ParcelPriceOfferForm({
  listingId,
  conversationId,
  suggestedPrice,
  currentPrice,
  submitLabel,
  onSubmitted,
}: {
  listingId: string;
  conversationId?: string;
  suggestedPrice: number;
  currentPrice?: number | null;
  submitLabel: string;
  onSubmitted?: (conversationId: string) => void;
}) {
  const router = useRouter();
  const bounds = bornesPrixOffre(suggestedPrice);
  const [price, setPrice] = useState(
    String(currentPrice ?? bounds.suggested),
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(price.replace(",", "."));
    setLoading(true);

    if (conversationId) {
      const result = await updateParcelOfferPrice(
        listingId,
        conversationId,
        amount,
      );
      setLoading(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Tarif proposé.");
      onSubmitted?.(conversationId);
      router.refresh();
      return;
    }

    const result = await proposeParcelTransport(listingId, amount);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      result.data.created
        ? "Proposition envoyée."
        : "Tarif proposé.",
    );
    onSubmitted?.(result.data.conversationId);
    router.push(`/compte/messages/${result.data.conversationId}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <AccountFieldLabel htmlFor="offer-price">
          Autre tarif (entre {formatPrixCad(bounds.min)} et {formatPrixCad(bounds.max)})
        </AccountFieldLabel>
        <input
          id="offer-price"
          type="number"
          inputMode="decimal"
          step="0.01"
          min={bounds.min}
          max={bounds.max}
          required
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className={ACCOUNT_FIELD}
        />
      </div>
      <p className="m-0 text-xs text-[#545454]">
        Prix affiché : {formatPrixCad(bounds.suggested)}
      </p>
      <button type="submit" disabled={loading} className="btn-brand h-14 w-full disabled:opacity-60">
        {loading ? "Envoi…" : submitLabel}
      </button>
    </form>
  );
}
