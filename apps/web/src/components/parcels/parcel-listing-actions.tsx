"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { proposeParcelTransport } from "@/lib/actions/messaging";
import type { ParcelListingStatus } from "@/lib/types";
import { formatPrixCad } from "@livre-moi/shared/pricing";

type Props = {
  listingId: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  acceptsParcels: boolean;
  identityVerified: boolean;
  listingStatus: ParcelListingStatus;
  existingConversationId: string | null;
  isChosenTransporter: boolean;
  suggestedPrice: number;
  agreedPrice: number | null;
};

export function ParcelListingActions({
  listingId,
  isOwner,
  isLoggedIn,
  acceptsParcels,
  identityVerified,
  listingStatus,
  existingConversationId,
  isChosenTransporter,
  suggestedPrice,
  agreedPrice,
}: Props) {
  const router = useRouter();
  const listingOpen = listingStatus === "OPEN";
  const nextPath = `/colis/${listingId}`;
  const [loading, setLoading] = useState(false);

  async function onAccept() {
    if (!isLoggedIn) {
      router.push(`/connexion?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (!acceptsParcels) {
      router.push("/compte/vehicule");
      return;
    }
    if (!identityVerified) {
      router.push("/compte/identite");
      return;
    }
    setLoading(true);
    const result = await proposeParcelTransport(listingId, suggestedPrice);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      result.data.created
        ? "Proposition envoyée au prix affiché."
        : "Conversation ouverte.",
    );
    router.push(`/compte/messages/${result.data.conversationId}`);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {isOwner ? (
        <>
          <Link href={`/colis/${listingId}/edit`} className="btn-brand w-full">
            Éditer mon colis
          </Link>
          <Link href="/compte/colis" className="btn-brand-secondary w-full">
            Gérer les propositions
          </Link>
          <p className="text-xs leading-relaxed text-[#545454]">
            {listingStatus === "MATCHED" ? (
              <>
                Ce colis est jumelé
                {agreedPrice != null ? ` à ${formatPrixCad(agreedPrice)}` : ""}.
                La négociation et le suivi se font dans{" "}
                <Link href="/compte/colis" className="underline underline-offset-2">
                  l&apos;espace compte
                </Link>
                .
              </>
            ) : listingOpen ? (
              <>
                Les propositions se gèrent dans{" "}
                <Link href="/compte/colis" className="underline underline-offset-2">
                  Mes colis
                </Link>
                . Un autre tarif peut se proposer dans le tchat, si besoin.
              </>
            ) : (
              "Cette annonce n'est plus ouverte."
            )}
          </p>
        </>
      ) : existingConversationId ? (
        <>
          <Link
            href={`/compte/messages/${existingConversationId}`}
            className="btn-brand w-full"
          >
            Ouvrir la conversation
          </Link>
          <p className="text-xs leading-relaxed text-[#545454]">
            {isChosenTransporter
              ? `L'expéditeur vous a retenu${agreedPrice != null ? ` à ${formatPrixCad(agreedPrice)}` : ""}.`
              : listingOpen
                ? "Le prix affiché s’applique. Un autre tarif peut se proposer dans le tchat."
                : "Ce colis a déjà un transporteur."}
          </p>
        </>
      ) : listingOpen ? (
        <>
          <button
            type="button"
            onClick={onAccept}
            disabled={loading}
            className="btn-brand w-full disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loading ? "Envoi…" : "Proposer de transporter"}
          </button>
          {!isLoggedIn ? (
            <p className="text-xs leading-relaxed text-[#545454]">
              Connectez-vous à votre compte pour proposer un tarif. Le montant
              affiché s&apos;applique d&apos;emblée.
            </p>
          ) : !acceptsParcels || !identityVerified ? (
            <p className="text-xs leading-relaxed text-[#545454]">
              Pour proposer un tarif,{" "}
              {!acceptsParcels ? (
                <>
                  activez « Accepter des colis » dans{" "}
                  <Link href="/compte/vehicule" className="underline underline-offset-2">
                    les paramètres du compte
                  </Link>
                </>
              ) : null}
              {!acceptsParcels && !identityVerified ? " et " : null}
              {!identityVerified ? (
                <>
                  faites vérifier votre identité dans{" "}
                  <Link href="/compte/identite" className="underline underline-offset-2">
                    l&apos;espace compte
                  </Link>
                </>
              ) : null}
              .
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-[#545454]">
              Une conversation s&apos;ouvre au prix affiché. Un autre tarif
              peut se proposer dans le tchat, si besoin.
            </p>
          )}
        </>
      ) : (
        <p className="text-xs leading-relaxed text-[#545454]">
          Cette annonce n&apos;accepte plus de propositions.
        </p>
      )}
    </div>
  );
}
