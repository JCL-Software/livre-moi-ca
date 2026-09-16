"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { submitReview } from "@/lib/actions/profile";
import { ACCOUNT_AREA, AccountFieldLabel } from "@/components/account/account-ui";
import { cn } from "@/lib/utils";

export function ReviewForm({
  bookingId,
  revieweeId,
  revieweeName,
}: {
  bookingId: string;
  revieweeId: string;
  revieweeName: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await submitReview({
      bookingId,
      revieweeId,
      rating,
      comment: comment.trim() || undefined,
    });
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Avis publié.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <p className="m-0 text-sm font-medium text-black">Laisser un avis à {revieweeName}</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Note">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-checked={rating === value}
            role="radio"
            className={cn(
              "h-9 w-9 rounded-full text-sm font-semibold",
              value <= rating ? "bg-black text-white" : "bg-[#EEEEEE] text-[#6B6B6B]",
            )}
            onClick={() => setRating(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div>
        <AccountFieldLabel htmlFor={`comment-${bookingId}`}>Commentaire (optionnel)</AccountFieldLabel>
        <textarea
          id={`comment-${bookingId}`}
          className={ACCOUNT_AREA}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
        />
      </div>
      <button type="submit" className="btn-brand h-12 px-5 disabled:opacity-50" disabled={loading}>
        {loading ? "Publication…" : "Publier l’avis"}
      </button>
    </form>
  );
}
