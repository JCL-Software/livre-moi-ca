"use client";

import { useState } from "react";
import { toast } from "sonner";
import { verifyDeliveryOtp } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OtpDialog({ bookingId }: { bookingId: string }) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Valider OTP</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preuve de livraison</DialogTitle>
          <DialogDescription>
            Demandez le code à 6 chiffres au destinataire, puis saisissez-le pour clôturer la
            livraison.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label htmlFor="otp">Code OTP</Label>
          <Input
            id="otp"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            placeholder="000000"
          />
          <Button className="w-full" onClick={onVerify} disabled={loading || code.length < 4}>
            {loading ? "Vérification…" : "Confirmer la livraison"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
