"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { proposeParcelTransport } from "@/lib/actions/messaging";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { cn } from "@/lib/utils";

type Props = {
  listingId: string;
  isOwner: boolean;
  isLoggedIn: boolean;
  acceptsParcels: boolean;
  identityVerified: boolean;
};

export function ParcelListingActions({
  listingId,
  isOwner,
  isLoggedIn,
  acceptsParcels,
  identityVerified,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const accountReady = isLoggedIn && acceptsParcels && identityVerified;
  const canPropose = accountReady && !isOwner;
  const nextPath = `/colis/${listingId}`;

  async function onPropose() {
    if (isOwner) return;
    if (!isLoggedIn) {
      router.push(`/connexion?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (!acceptsParcels || !identityVerified) {
      router.push("/profil");
      return;
    }

    setLoading(true);
    const result = await proposeParcelTransport(listingId);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Proposition envoyée. Vous pouvez discuter avec l'expéditeur.");
    router.push(`/messages/${result.data.conversationId}`);
  }

  return (
    <div className="space-y-3">
      {isOwner ? (
        <Link href={`/colis/${listingId}/edit`} className="btn-brand w-full">
          Éditer mon colis
        </Link>
      ) : null}

      <MovingBorderButton
        type="button"
        onClick={onPropose}
        disabled={loading || isOwner}
        borderRadius="0.5rem"
        duration={5000}
        containerClassName={cn(
          "h-[54px] w-full p-[1px] text-base disabled:cursor-not-allowed disabled:opacity-45",
          !canPropose && "opacity-45",
        )}
        borderClassName="h-16 w-16 bg-[radial-gradient(#000000_40%,transparent_60%)] opacity-50"
        className="border-neutral-200 bg-white px-6 text-base font-medium text-black hover:bg-neutral-50 dark:border-white/15 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
      >
        {loading ? "Mise en relation…" : "Accepter ce colis"}
      </MovingBorderButton>

      {isOwner ? (
        <div className="space-y-1 text-xs leading-relaxed text-neutral-500">
          <p>Vous êtes l&apos;expéditeur de cette annonce.</p>
          <p>
            Publier un colis n&apos;empêche pas d&apos;en accepter d&apos;autres
            : activez « Accepter des colis » dans{" "}
            <Link href="/profil" className="underline underline-offset-2">
              les paramètres du compte
            </Link>{" "}
            et faites vérifier votre identité.
          </p>
        </div>
      ) : !isLoggedIn ? (
        <p className="text-xs leading-relaxed text-neutral-500">
          Connectez-vous à votre compte pour accepter ce colis.
        </p>
      ) : !acceptsParcels || !identityVerified ? (
        <p className="text-xs leading-relaxed text-neutral-500">
          Pour accepter un colis,{" "}
          {!acceptsParcels ? (
            <>
              activez « Accepter des colis » dans{" "}
              <Link href="/profil" className="underline underline-offset-2">
                les paramètres du compte
              </Link>
            </>
          ) : null}
          {!acceptsParcels && !identityVerified ? " et " : null}
          {!identityVerified
            ? "faites vérifier votre identité (KYC)"
            : null}
          .
        </p>
      ) : (
        <p className="text-xs leading-relaxed text-neutral-500">
          L&apos;expéditeur recevra une notification afin de pouvoir échanger
          avec vous.
        </p>
      )}
    </div>
  );
}
