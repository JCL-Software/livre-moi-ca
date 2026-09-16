"use client";

import { toast } from "sonner";
import { cancelTrip } from "@/lib/actions/trips";

export function CancelTripButton({ tripId }: { tripId: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center rounded-lg px-4 text-sm font-medium text-[#545454] transition-colors hover:bg-[#F6F6F6] hover:text-black"
      onClick={async () => {
        const result = await cancelTrip(tripId);
        if (!result.ok) toast.error(result.error);
        else toast.success("Trajet annulé.");
      }}
    >
      Annuler le trajet
    </button>
  );
}
