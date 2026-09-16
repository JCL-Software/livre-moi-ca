import Link from "next/link";
import { MessageCircle, UserRound } from "lucide-react";
import {
  AccountPriceBlock,
  AccountStatusPill,
  memberProfileHref,
} from "@/components/account/account-ui";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { ConfirmParcelOfferButton } from "@/components/parcels/confirm-parcel-offer-button";
import type { ParcelListingStatus, ParcelTransportOffer } from "@/lib/types";
import { formatPrixCad } from "@livre-moi/shared/pricing";

function priceDelta(proposed: number, suggested: number) {
  const diff = Number((proposed - suggested).toFixed(2));
  if (diff === 0) return "égal au prix suggéré";
  const formatted = formatPrixCad(Math.abs(diff));
  return diff > 0 ? `+${formatted} vs affiché` : `−${formatted} vs affiché`;
}

export function ParcelOffersList({
  offers,
  listingStatus,
  canConfirm,
}: {
  offers: ParcelTransportOffer[];
  listingStatus: ParcelListingStatus;
  canConfirm: boolean;
}) {
  const open = listingStatus === "OPEN";

  if (offers.length === 0) {
    return (
      <div className="rounded-lg bg-[#EEEEEE] px-4 py-3 text-sm text-[#545454]">
        {open
          ? "Aucun voyageur n’a encore proposé de transporter ce colis."
          : "Aucune proposition sur cette annonce."}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {offers.map((offer) => {
        const chosen = offer.matchedConversationId === offer.conversationId;
        const displayPrice = chosen
          ? offer.agreedPrice ?? offer.proposedPrice
          : offer.proposedPrice;
        const fromDriver = offer.proposedBy === offer.initiatorId;
        const canRetain =
          canConfirm && open && displayPrice != null && fromDriver;
        const negotiated =
          displayPrice != null &&
          offer.suggestedPrice != null &&
          displayPrice !== offer.suggestedPrice;
        const priceLabel = chosen
          ? "Prix convenu"
          : negotiated
            ? "Tarif proposé"
            : "Prix affiché";
        const status = chosen
          ? { tone: "solid" as const, label: "Transporteur retenu" }
          : listingStatus === "MATCHED"
            ? { tone: "muted" as const, label: "Non retenu" }
            : open && negotiated
              ? {
                  tone: "soft" as const,
                  label: fromDriver
                    ? "En attente de votre confirmation"
                    : "Contre-proposition",
                }
              : null;

        return (
          <UberCard as="li" key={offer.conversationId}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {offer.counterpartId ? (
                  <Link
                    href={memberProfileHref(offer.counterpartId)}
                    className="inline-flex shrink-0 no-underline"
                    title={`Voir le profil de ${offer.counterpartName}`}
                  >
                    <UberAvatar
                      name={offer.counterpartName}
                      src={offer.counterpartAvatarUrl}
                      size="36px"
                      verified={offer.counterpartVerified}
                    />
                  </Link>
                ) : (
                  <UberAvatar
                    name={offer.counterpartName}
                    src={offer.counterpartAvatarUrl}
                    size="36px"
                    verified={offer.counterpartVerified}
                  />
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {offer.counterpartId ? (
                      <Link
                        href={memberProfileHref(offer.counterpartId)}
                        className="uber-card-title hover:underline"
                      >
                        {offer.counterpartName}
                      </Link>
                    ) : (
                      <p className="uber-card-title m-0">{offer.counterpartName}</p>
                    )}
                    {status ? (
                      <AccountStatusPill tone={status.tone}>{status.label}</AccountStatusPill>
                    ) : null}
                  </div>
                  {offer.lastMessage ? (
                    <p className="m-0 line-clamp-2 text-sm text-[#545454]">
                      {offer.lastMessage}
                    </p>
                  ) : null}
                </div>
              </div>
              {displayPrice != null ? (
                <AccountPriceBlock
                  amount={displayPrice}
                  label={
                    offer.suggestedPrice != null && negotiated && !chosen
                      ? `${priceLabel} · ${priceDelta(displayPrice, offer.suggestedPrice)}`
                      : priceLabel
                  }
                />
              ) : (
                <p className="m-0 text-sm text-[#545454]">Prix à confirmer</p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {offer.counterpartId ? (
                <Link
                  href={memberProfileHref(offer.counterpartId)}
                  className={
                    chosen
                      ? "btn-brand h-10 gap-1.5 px-4 py-0 text-sm"
                      : "btn-brand-secondary h-10 gap-1.5 px-4 py-0 text-sm"
                  }
                >
                  <UserRound className="h-4 w-4" aria-hidden />
                  Voir le profil
                </Link>
              ) : null}
              <Link
                href={`/compte/messages/${offer.conversationId}`}
                className="btn-brand-secondary h-10 gap-1.5 px-4 py-0 text-sm"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Ouvrir le tchat
              </Link>
              {canConfirm && open ? (
                <>
                  <Link
                    href={`/compte/messages/${offer.conversationId}?onglet=tarif`}
                    className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-[#545454] transition-colors hover:bg-[#F6F6F6] hover:text-black"
                  >
                    Proposer un tarif
                  </Link>
                  <ConfirmParcelOfferButton
                    listingId={offer.listingId}
                    conversationId={offer.conversationId}
                    price={displayPrice}
                    disabled={!canRetain}
                  />
                </>
              ) : null}
            </div>
          </UberCard>
        );
      })}
    </ul>
  );
}
