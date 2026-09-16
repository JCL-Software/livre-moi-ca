"use client";

import { Button, KIND, SIZE } from "baseui/button";
import { toast } from "sonner";
import { cancelTrip } from "@/lib/actions/trips";

export function CancelTripButton({ tripId }: { tripId: string }) {
  return (
    <Button
      kind={KIND.tertiary}
      size={SIZE.compact}
      onClick={async () => {
        const result = await cancelTrip(tripId);
        if (!result.ok) toast.error(result.error);
        else toast.success("Trajet annulé.");
      }}
    >
      Annuler le trajet
    </Button>
  );
}
