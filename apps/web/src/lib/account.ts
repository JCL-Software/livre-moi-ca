import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireAccount = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/compte");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, full_name, phone, bio, avatar_url, is_driver, vehicle_model, vehicle_plate, vehicle_color, rating_avg, rating_count, identity_verified, accepts_parcels",
    )
    .eq("id", user.id)
    .maybeSingle();

  return { supabase, user, profile };
});

export function toProfileFormValues(profile: {
  full_name?: string | null;
  phone?: string | null;
  bio?: string | null;
  is_driver?: boolean | null;
  vehicle_model?: string | null;
  vehicle_plate?: string | null;
  vehicle_color?: string | null;
  avatar_url?: string | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  accepts_parcels?: boolean | null;
  identity_verified?: boolean | null;
} | null) {
  return {
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
    accepts_parcels: Boolean(profile?.accepts_parcels),
    identity_verified: Boolean(profile?.identity_verified),
  };
}
