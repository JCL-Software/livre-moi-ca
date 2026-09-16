"use client";

import { toast } from "sonner";
import { markAllNotificationsRead } from "@/lib/actions/messaging";

export function MarkNotificationsReadButton() {
  return (
    <button
      type="button"
      className="btn-brand-secondary h-10 px-4 py-0 text-sm"
      onClick={async () => {
        const result = await markAllNotificationsRead();
        if (!result.ok) toast.error(result.error);
        else toast.success("Notifications marquées comme lues.");
      }}
    >
      Tout marquer comme lu
    </button>
  );
}
