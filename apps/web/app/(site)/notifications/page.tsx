import Link from "next/link";
import { redirect } from "next/navigation";
import { openNotification } from "@/lib/actions/messaging";
import { createClient } from "@/lib/supabase/server";
import { listUserNotifications } from "@livre-moi/shared/data";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/connexion?next=/notifications");
  }

  const result = await listUserNotifications(supabase, user.id);
  const notifications = result.ok ? result.data : [];

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Les propositions de transport et messages liés à vos annonces.
          </p>
        </div>

        {notifications.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#E8E8E8] bg-white p-8 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900">
            Aucune notification pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((item) => (
              <li key={item.id}>
                <form action={openNotification.bind(null, item.id, item.link ?? "/colis")}>
                  <button
                    type="submit"
                    className={`w-full rounded-2xl border p-4 text-left transition-colors hover:border-black dark:hover:border-white ${
                      item.read_at
                        ? "border-[#E8E8E8] bg-white dark:border-white/10 dark:bg-neutral-900"
                        : "border-black bg-[#F6F6F6] dark:border-white dark:bg-neutral-800"
                    }`}
                  >
                    <p className="text-sm font-semibold text-black dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {item.body}
                    </p>
                    <p className="mt-2 text-xs text-neutral-400">
                      {new Date(item.created_at).toLocaleString("fr-CA")}
                    </p>
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <Link href="/colis" className="text-sm text-neutral-500 underline-offset-4 hover:underline">
          ← Colis disponibles
        </Link>
      </div>
    </section>
  );
}
