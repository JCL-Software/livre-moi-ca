"use client";

import { Button, KIND, SIZE } from "baseui/button";
import { toast } from "sonner";
import { markAllNotificationsRead } from "@/lib/actions/messaging";

export function MarkNotificationsReadButton() {
  return (
    <Button
      kind={KIND.secondary}
      size={SIZE.compact}
      onClick={async () => {
        const result = await markAllNotificationsRead();
        if (!result.ok) toast.error(result.error);
        else toast.success("Notifications marquées comme lues.");
      }}
    >
      Tout marquer comme lu
    </Button>
  );
}
