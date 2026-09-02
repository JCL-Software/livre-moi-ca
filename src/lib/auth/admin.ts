import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminContext = {
  userId: string;
  email: string;
  fullName: string;
};

export async function requireAdmin(): Promise<AdminContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ADMIN") {
    redirect("/?access=admin-denied");
  }

  return {
    userId: user.id,
    email: profile.email ?? user.email ?? "",
    fullName: profile.full_name || "Administrateur",
  };
}
