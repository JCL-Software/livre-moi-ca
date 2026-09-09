"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  email: string;
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
  };
};

export function ProfileForm({ email, profile }: Props) {
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
    });
    setLoading(false);
    if (!result.ok) toast.error(result.error);
    else toast.success("Profil enregistré.");
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">
          {email} · {form.rating_avg.toFixed(1)} / 5 ({form.rating_count} avis)
        </p>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Nom</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(event) => setForm({ ...form, full_name: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avatar">Photo de profil</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUpload(file);
              }}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Je suis conducteur</p>
              <p className="text-sm text-muted-foreground">Affiche les infos véhicule.</p>
            </div>
            <Switch
              checked={form.is_driver}
              onCheckedChange={(value) => setForm({ ...form, is_driver: value })}
            />
          </div>
          {form.is_driver && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="model">Véhicule</Label>
                <Input
                  id="model"
                  value={form.vehicle_model}
                  onChange={(event) => setForm({ ...form, vehicle_model: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  value={form.vehicle_color}
                  onChange={(event) => setForm({ ...form, vehicle_color: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="plate">Plaque</Label>
                <Input
                  id="plate"
                  value={form.vehicle_plate}
                  onChange={(event) => setForm({ ...form, vehicle_plate: event.target.value })}
                />
              </div>
            </div>
          )}
          <Button disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
