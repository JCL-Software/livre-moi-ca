"use client";

import { useEffect, useState } from "react";
import { Button, KIND, SIZE } from "baseui/button";
import { toast } from "sonner";
import { ACCOUNT_FIELD, AccountFieldLabel } from "@/components/account/account-ui";
import { UberCard } from "@/components/baseweb/uber-ui";
import { verifyDeliveryOtp } from "@/lib/actions/bookings";

export function OtpDialog({ bookingId }: { bookingId: string }) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function onVerify() {
    setLoading(true);
    const result = await verifyDeliveryOtp(bookingId, code);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Livraison confirmée. Le colis est remis.");
    setOpen(false);
    setCode("");
  }

  return (
    <>
      <Button kind={KIND.primary} size={SIZE.compact} onClick={() => setOpen(true)}>
        Valider OTP
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-md" onClick={(event) => event.stopPropagation()}>
            <UberCard>
              <p className="uber-home-kicker m-0">Preuve de livraison</p>
              <h2 className="uber-section-title mt-2 mb-0">Code destinataire</h2>
              <p className="mt-2 mb-0 text-sm leading-relaxed text-[#545454]">
                Demandez le code à 6 chiffres au destinataire, puis saisissez-le pour
                clôturer la livraison.
              </p>
              <div className="mt-5">
                <AccountFieldLabel htmlFor="otp">Code OTP</AccountFieldLabel>
                <input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className={ACCOUNT_FIELD}
                  autoFocus
                />
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  kind={KIND.secondary}
                  size={SIZE.large}
                  overrides={{ BaseButton: { style: { flex: 1 } } }}
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button
                  kind={KIND.primary}
                  size={SIZE.large}
                  overrides={{ BaseButton: { style: { flex: 1 } } }}
                  onClick={onVerify}
                  disabled={loading || code.length < 4}
                  isLoading={loading}
                >
                  Confirmer
                </Button>
              </div>
            </UberCard>
          </div>
        </div>
      ) : null}
    </>
  );
}
