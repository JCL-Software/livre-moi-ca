import { UberCard, UberTag } from "@/components/baseweb/uber-ui";
import { AcceptParcelPriceButton } from "@/components/parcels/accept-parcel-price-button";
import { ParcelPriceOfferForm } from "@/components/parcels/parcel-price-offer-form";
import { formatPrixCad } from "@livre-moi/shared/pricing";

export function ConversationTarifPanel({
  listingId,
  conversationId,
  suggestedPrice,
  proposedPrice,
  proposedByInitiator,
  agreedPrice,
  listingOpen,
  isOwner,
  isDriver,
  priceAcknowledged,
  counterpartAcknowledged,
}: {
  listingId: string;
  conversationId: string;
  suggestedPrice: number;
  proposedPrice: number | null;
  proposedByInitiator: boolean;
  agreedPrice: number | null;
  listingOpen: boolean;
  isOwner: boolean;
  isDriver: boolean;
  priceAcknowledged: boolean;
  counterpartAcknowledged: boolean;
}) {
  const current = agreedPrice ?? proposedPrice ?? suggestedPrice;
  const alternate =
    agreedPrice == null &&
    proposedPrice != null &&
    proposedPrice !== suggestedPrice;
  const ownerCanMatch = listingOpen && isOwner && proposedByInitiator;
  const driverCanAcceptCounter =
    listingOpen && isDriver && !proposedByInitiator && proposedPrice != null;
  const canConfirmDisplayed =
    listingOpen &&
    !priceAcknowledged &&
    isDriver &&
    proposedByInitiator;

  if (agreedPrice != null) {
    return (
      <UberCard>
        <UberTag tone="success">Prix convenu</UberTag>
        <p className="uber-home-title mt-3 mb-0">{formatPrixCad(agreedPrice)}</p>
        <p className="mt-2 mb-0 text-sm leading-relaxed text-[#545454]">
          {suggestedPrice !== agreedPrice
            ? `Ce tarif est accepté et le transporteur est retenu (prix affiché au départ : ${formatPrixCad(suggestedPrice)}).`
            : "Ce tarif est accepté et le transporteur est retenu."}
        </p>
      </UberCard>
    );
  }

  return (
    <UberCard>
      <p className="uber-home-kicker m-0">
        {alternate ? "Tarif proposé" : "Prix affiché"}
      </p>
      <p className="uber-price mt-2 mb-0">{formatPrixCad(current)}</p>
      <p className="mt-2 mb-0 text-sm leading-relaxed text-[#545454]">
        {priceAcknowledged
          ? "Vous avez accepté ce tarif. L’expéditeur peut maintenant le confirmer."
          : counterpartAcknowledged && isOwner
            ? "Le voyageur a accepté ce tarif. Confirmez pour retenir le transporteur."
            : alternate
              ? proposedByInitiator
                ? `Le voyageur propose ${formatPrixCad(proposedPrice!)} au lieu du prix affiché (${formatPrixCad(suggestedPrice)}).`
                : `L’expéditeur propose ${formatPrixCad(proposedPrice!)} au lieu du prix affiché (${formatPrixCad(suggestedPrice)}).`
              : "Vous partez tous les deux sur ce tarif. Acceptez-le, ou proposez un autre montant."}
      </p>

      {listingOpen && (isOwner || isDriver) ? (
        <div className="mt-5 max-w-sm space-y-4">
          {ownerCanMatch ? (
            <AcceptParcelPriceButton
              listingId={listingId}
              conversationId={conversationId}
              price={current}
              mode="match"
            />
          ) : null}
          {driverCanAcceptCounter ? (
            <AcceptParcelPriceButton
              listingId={listingId}
              conversationId={conversationId}
              price={proposedPrice!}
              mode="counter"
            />
          ) : null}
          {canConfirmDisplayed ? (
            <AcceptParcelPriceButton
              listingId={listingId}
              conversationId={conversationId}
              price={current}
              mode="confirm"
            />
          ) : null}

          <div className="space-y-3 border-t border-[#EEEEEE] pt-4">
            <p className="m-0 text-xs font-medium text-[#545454]">
              Ou proposer un autre tarif
            </p>
            <ParcelPriceOfferForm
              key={`${conversationId}-${proposedPrice ?? "none"}`}
              listingId={listingId}
              conversationId={conversationId}
              suggestedPrice={suggestedPrice}
              currentPrice={proposedPrice ?? suggestedPrice}
              submitLabel="Proposer ce tarif"
            />
          </div>
        </div>
      ) : null}
    </UberCard>
  );
}
