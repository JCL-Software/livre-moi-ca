import { createClient } from "@/lib/supabase/server";
import { UberHeader } from "@/components/baseweb/uber-header";
import { countUnreadNotifications } from "@livre-moi/shared/data";

export async function Header() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  if (!configured) {
    return <UberHeader user={null} />;
  }

  const supabase = await createClient();
  const session = await supabase.auth.getUser();
  const user = session.data.user;
  if (!user) {
    return <UberHeader user={null} />;
  }

  const [unread, profileResult] = await Promise.all([
    countUnreadNotifications(supabase, user.id),
    supabase.from("profiles").select("avatar_url, full_name, identity_verified").eq("id", user.id).maybeSingle(),
  ]);
  const metadata = user.user_metadata as {
    avatar_url?: string;
    picture?: string;
    full_name?: string;
  };

  return (
    <UberHeader
      user={{
        email: user.email ?? "",
        name: profileResult.data?.full_name || metadata.full_name || "",
        avatarUrl:
          profileResult.data?.avatar_url || metadata.avatar_url || metadata.picture || null,
        identityVerified: Boolean(profileResult.data?.identity_verified),
        unreadNotifications: unread,
      }}
    />
  );
}
