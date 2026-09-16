"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";
import {
  ACCOUNT_AREA,
  ACCOUNT_FIELD,
  AccountFieldLabel,
} from "@/components/account/account-ui";
import { UberAvatar, UberCard } from "@/components/baseweb/uber-ui";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  mode?: "identity" | "vehicle";
  profile: {
    full_name: string;
    phone: string;
    bio: string;
    is_driver: boolean;
    vehicle_model: string;
    vehicle_plate: string;
    vehicle_color: string;
    avatar_url: string;
    rating_avg: number;
    rating_count: number;
    accepts_parcels: boolean;
    identity_verified: boolean;
  };
};

function AccountSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-black" : "bg-[#EEEEEE]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function ProfileForm({ email, profile, mode = "identity" }: Props) {
  const [form, setForm] = useState(profile);
  const [loading, setLoading] = useState(false);

  async function onUpload(file: File) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const path = `${user.id}/${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setForm((current) => ({ ...current, avatar_url: data.publicUrl }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await updateProfile({
      fullName: form.full_name,
      phone: form.phone,
      bio: form.bio,
      isDriver: form.is_driver,
      vehicleModel: form.vehicle_model,
      vehiclePlate: form.vehicle_plate,
      vehicleColor: form.vehicle_color,
      avatarUrl: form.avatar_url,
      acceptsParcels: form.accepts_parcels,
    });
    setLoading(false);
    if (!result.ok) toast.error(result.error);
    else toast.success("Profil enregistré.");
  }

  return (
    <UberCard>
      <form className="space-y-5" onSubmit={onSubmit}>
        {mode === "identity" ? (
          <p className="m-0 text-sm text-[#545454]">
            {email} · {form.rating_avg.toFixed(1)} / 5 ({form.rating_count} avis)
          </p>
        ) : (
          <p className="m-0 text-sm text-[#545454]">
            Ces informations s&apos;affichent aux passagers et expéditeurs lorsque vous
            publiez un trajet ou acceptez un colis.
          </p>
        )}
          {mode === "identity" ? (
            <>
              <div>
                <AccountFieldLabel htmlFor="full_name">Nom</AccountFieldLabel>
                <input
                  id="full_name"
                  className={ACCOUNT_FIELD}
                  value={form.full_name}
                  onChange={(event) => setForm({ ...form, full_name: event.target.value })}
                />
              </div>
              <div>
                <AccountFieldLabel htmlFor="phone">Téléphone</AccountFieldLabel>
                <input
                  id="phone"
                  className={ACCOUNT_FIELD}
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </div>
              <div>
                <AccountFieldLabel htmlFor="bio">Bio</AccountFieldLabel>
                <textarea
                  id="bio"
                  className={ACCOUNT_AREA}
                  value={form.bio}
                  onChange={(event) => setForm({ ...form, bio: event.target.value })}
                />
              </div>
              <div>
                <AccountFieldLabel htmlFor="avatar">Photo de profil</AccountFieldLabel>
                <div className="flex items-center gap-3">
                  <UberAvatar
                    name={form.full_name || "Compte"}
                    src={form.avatar_url || null}
                    size="48px"
                    verified={form.identity_verified}
                  />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="min-w-0 flex-1 text-sm text-[#545454] file:mr-3 file:h-11 file:rounded-lg file:border-0 file:bg-[#EEEEEE] file:px-4 file:font-medium file:text-black hover:file:bg-[#E4E4E4]"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void onUpload(file);
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F6F6F6] p-4">
                <div>
                  <p className="m-0 font-medium text-black">Je suis conducteur</p>
                  <p className="mt-1 mb-0 text-sm text-[#545454]">Affiche les infos véhicule.</p>
                </div>
                <AccountSwitch
                  checked={form.is_driver}
                  label="Je suis conducteur"
                  onChange={(value) => setForm({ ...form, is_driver: value })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-[#F6F6F6] p-4">
                <div>
                  <p className="m-0 font-medium text-black">Accepter des colis</p>
                  <p className="mt-1 mb-0 text-sm text-[#545454]">
                    Publier un colis n&apos;empêche pas d&apos;en transporter
                    d&apos;autres. Activez cette option pour proposer un transport.
                  </p>
                </div>
                <AccountSwitch
                  checked={form.accepts_parcels}
                  label="Accepter des colis"
                  onChange={(value) =>
                    setForm({
                      ...form,
                      accepts_parcels: value,
                      is_driver: value ? true : form.is_driver,
                    })
                  }
                />
              </div>
              {form.is_driver && (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <AccountFieldLabel htmlFor="model">Véhicule</AccountFieldLabel>
                    <input
                      id="model"
                      className={ACCOUNT_FIELD}
                      value={form.vehicle_model}
                      onChange={(event) => setForm({ ...form, vehicle_model: event.target.value })}
                    />
                  </div>
                  <div>
                    <AccountFieldLabel htmlFor="color">Couleur</AccountFieldLabel>
                    <input
                      id="color"
                      className={ACCOUNT_FIELD}
                      value={form.vehicle_color}
                      onChange={(event) => setForm({ ...form, vehicle_color: event.target.value })}
                    />
                  </div>
                  <div>
                    <AccountFieldLabel htmlFor="plate">Plaque</AccountFieldLabel>
                    <input
                      id="plate"
                      className={ACCOUNT_FIELD}
                      value={form.vehicle_plate}
                      onChange={(event) => setForm({ ...form, vehicle_plate: event.target.value })}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <button type="submit" className="btn-brand h-14 px-6 disabled:opacity-50" disabled={loading}>
            {loading ? "Enregistrement…" : "Enregistrer"}
          </button>
      </form>
    </UberCard>
  );
}
