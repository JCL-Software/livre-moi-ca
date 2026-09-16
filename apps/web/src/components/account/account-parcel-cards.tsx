import Link from "next/link";
import { ArrowRight, MessageCircle, Package, Pencil } from "lucide-react";
import {
  AccountIconTile,
  AccountPriceBlock,
  AccountStatusPill,
  memberProfileHref,
} from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";
import { ParcelOffersList } from "@/components/parcels/parcel-offers-list";
import { shortPlace } from "@/lib/account-format";
import { PARCEL_LISTING_STATUS_LABELS } from "@/lib/constants";
import type { ParcelListingStatus, ParcelTransportOffer } from "@/lib/types";

function listingTone(status: ParcelListingStatus): "solid" | "soft" | "muted" | "success" {
  if (status === "MATCHED") return "success";
  if (status === "OPEN") return "soft";
  return "muted";
}

export function AccountOwnerParcelCard({
  listing,
  offers,
}: {
  listing: {
    id: string;
    title: string;
    origin_name: string;
    destination_name: string;
    status: string;
    estimated_price: number | null;
    matched_conversation_id: string | null;
  };
  offers: ParcelTransportOffer[];
}) {
  const status = listing.status as ParcelListingStatus;
  const matched = offers.find(
    (offer) => offer.conversationId === listing.matched_conversation_id,
  );
  const agreed = matched?.agreedPrice ?? null;
  const suggested =
    listing.estimated_price != null ? Number(listing.estimated_price) : null;
  const price = agreed ?? suggested;
  const priceLabel = agreed != null ? "Prix convenu" : "Prix suggéré";

  return (
    <UberCard as="li">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <AccountIconTile>
            <Package className="h-5 w-5" aria-hidden />
          </AccountIconTile>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/colis/${listing.id}`}
                className="uber-card-title hover:underline"
              >
                {listing.title}
              </Link>
              <AccountStatusPill
                tone={listingTone(status)}
                href={
                  status === "MATCHED" && matched?.counterpartId
                    ? memberProfileHref(matched.counterpartId)
                    : undefined
                }
              >
                {PARCEL_LISTING_STATUS_LABELS[status] ?? status}
              </AccountStatusPill>
            </div>
            <p className="text-sm font-medium text-[#545454]">
              {shortPlace(listing.origin_name)} → {shortPlace(listing.destination_name)}
            </p>
            {offers.length > 0 ? (
              <p className="text-sm text-neutral-500">
                {offers.length} proposition{offers.length > 1 ? "s" : ""}
              </p>
            ) : null}
          </div>
        </div>
        <AccountPriceBlock amount={price} label={priceLabel} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/colis/${listing.id}`}
          className="btn-brand-secondary h-10 gap-1.5 px-4 py-0 text-sm"
        >
          Voir l&apos;annonce
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href={`/colis/${listing.id}/edit`}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-[#545454] transition-colors hover:bg-[#F6F6F6] hover:text-black"
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Éditer
        </Link>
      </div>

      <div className="mt-4">
        <ParcelOffersList offers={offers} listingStatus={status} canConfirm />
      </div>
    </UberCard>
  );
}

export function AccountDriverParcelCard({ offer }: { offer: ParcelTransportOffer }) {
  const chosen = offer.matchedConversationId === offer.conversationId;
  const listingMatched = offer.listingStatus === "MATCHED";
  const listingOpen = offer.listingStatus === "OPEN";
  const negotiated =
    offer.proposedPrice != null &&
    offer.suggestedPrice != null &&
    offer.proposedPrice !== offer.suggestedPrice;
  const price = chosen
    ? (offer.agreedPrice ?? offer.proposedPrice)
    : (offer.proposedPrice ?? offer.suggestedPrice);
  const priceLabel = chosen
    ? "Prix convenu"
    : negotiated
      ? "Tarif proposé"
      : "Prix affiché";
  const status = chosen
    ? { tone: "solid" as const, label: "Retenu" }
    : listingMatched
      ? { tone: "muted" as const, label: "Non retenu" }
      : { tone: "soft" as const, label: "Proposition envoyée" };

  return (
    <UberCard as="li">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <AccountIconTile>
            <Package className="h-5 w-5" aria-hidden />
          </AccountIconTile>
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/colis/${offer.listingId}`}
                className="uber-card-title hover:underline"
              >
                {offer.listingTitle}
              </Link>
              <AccountStatusPill tone={status.tone}>{status.label}</AccountStatusPill>
            </div>
            <p className="text-sm font-medium text-[#545454]">
              {offer.listingRoute}
            </p>
            <p className="text-sm text-neutral-500">
              {offer.counterpartId ? (
                <>
                  Avec{" "}
                  <Link
                    href={memberProfileHref(offer.counterpartId)}
                    className="font-medium text-black underline-offset-2 hover:underline"
                  >
                    {offer.counterpartName}
                  </Link>
                </>
              ) : (
                <>Avec {offer.counterpartName}</>
              )}
            </p>
          </div>
        </div>
        <AccountPriceBlock amount={price} label={priceLabel} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/compte/messages/${offer.conversationId}`}
          className="btn-brand h-10 gap-1.5 px-4 py-0 text-sm"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Ouvrir le tchat
        </Link>
        {listingOpen ? (
          <Link
            href={`/compte/messages/${offer.conversationId}?onglet=tarif`}
            className="btn-brand-secondary h-10 px-4 py-0 text-sm"
          >
            Proposer un tarif
          </Link>
        ) : null}
        <Link
          href={`/colis/${offer.listingId}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-[#545454] transition-colors hover:bg-[#F6F6F6] hover:text-black"
        >
          Voir l&apos;annonce
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </UberCard>
  );
}
