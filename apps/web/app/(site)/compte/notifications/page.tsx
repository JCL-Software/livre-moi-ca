import { AccountEmpty } from "@/components/account/account-empty";
import { AccountNotificationsList } from "@/components/account/account-notifications-list";
import { AccountPageHeader } from "@/components/account/account-page-header";
import { MarkNotificationsReadButton } from "@/components/account/mark-notifications-read-button";
import { requireAccount } from "@/lib/account";
import { listUserNotifications } from "@livre-moi/shared/data";

export default async function AccountNotificationsPage() {
  const { supabase, user } = await requireAccount();
  const result = await listUserNotifications(supabase, user.id);
  const notifications = result.ok ? result.data : [];
  const unread = notifications.some((item) => !item.read_at);

  return (
    <div>
      <AccountPageHeader
        title="Notifications"
        description="Propositions de transport, messages et suivis liés à votre compte."
        actions={unread ? <MarkNotificationsReadButton /> : null}
      />

      {notifications.length === 0 ? (
        <AccountEmpty
          title="Aucune notification"
          description="Vous serez prévenu ici lorsqu’un voyageur propose de transporter un colis."
        />
      ) : (
        <AccountNotificationsList items={notifications} />
      )}
    </div>
  );
}
