import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Compte</p>
        <h1 className="text-3xl font-bold tracking-tight">Profil et véhicule</h1>
      </div>
      <ProfileForm
        email={user!.email ?? ""}
        profile={{
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          bio: profile?.bio ?? "",
          is_driver: profile?.is_driver ?? false,
          vehicle_model: profile?.vehicle_model ?? "",
          vehicle_plate: profile?.vehicle_plate ?? "",
          vehicle_color: profile?.vehicle_color ?? "",
          avatar_url: profile?.avatar_url ?? "",
          rating_avg: Number(profile?.rating_avg ?? 5),
          rating_count: profile?.rating_count ?? 0,
        }}
      />
    </div>
  );
}
