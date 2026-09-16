import { Suspense } from "react";
import { AccountNav } from "@/components/account/account-nav";
import { requireAccount } from "@/lib/account";
import { countUnreadNotifications } from "@livre-moi/shared/data";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { supabase, user, profile } = await requireAccount();
  const unread = await countUnreadNotifications(supabase, user.id);

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Suspense>
            <AccountNav
              name={profile?.full_name ?? ""}
              email={user.email ?? ""}
              avatarUrl={profile?.avatar_url ?? null}
              verified={Boolean(profile?.identity_verified)}
              unread={unread}
            />
          </Suspense>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

