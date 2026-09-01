"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createBooking } from "@/lib/actions/bookings";
import { PARCEL_LABELS } from "@/lib/constants";
import type { BookingType, ParcelSize } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  tripId: string;
  availableSeats: number;
  pricePerSeat: number;
  acceptsParcels: boolean;
  parcelBasePrice: number;
  loggedIn: boolean;
};

export function BookingForm({
  tripId,
  availableSeats,
  pricePerSeat,
  acceptsParcels,
  parcelBasePrice,
  loggedIn,
}: Props) {
  const router = useRouter();
  const [type, setType] = useState<BookingType>(availableSeats > 0 ? "PASSENGER" : "PARCEL");
  const [seats, setSeats] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<ParcelSize>("SMALL");
  const [weight, setWeight] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!loggedIn) {
      router.push(`/connexion?next=/trajets/${tripId}`);
      return;
    }
    setLoading(true);
    let photoUrl: string | undefined;

    if (photoFile) {
      const supabase = createClient();
      const path = `${tripId}/${Date.now()}-${photoFile.name}`;
      const { error } = await supabase.storage.from("parcels").upload(path, photoFile);
      if (error) {
        toast.error("Échec du téléversement de la photo.");
        setLoading(false);
        return;
      }
      photoUrl = path;
    }

    const result = await createBooking({
      tripId,
      bookingType: type,
      seatsBooked: seats,
      parcelTitle: title,
      parcelDescription: description,
      parcelSize: size,
      parcelWeightKg: weight,
      parcelPhotoUrl: photoUrl,
      recipientName,
      recipientPhone,
    });
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    if (result.data.otp) {
      toast.success(`Réservation créée. Code de livraison : ${result.data.otp}`);
    } else {
      toast.success("Demande envoyée au conducteur.");
    }
    router.push("/tableau-de-bord");
  }

  return (
    <div className="space-y-4">
      <Tabs value={type} onValueChange={(value) => setType(value as BookingType)}>
        <TabsList className="w-full">
          <TabsTrigger value="PASSENGER" disabled={availableSeats < 1} className="flex-1">
            Place · {pricePerSeat.toFixed(0)} $
          </TabsTrigger>
          <TabsTrigger value="PARCEL" disabled={!acceptsParcels} className="flex-1">
            Colis · dès {parcelBasePrice.toFixed(0)} $
          </TabsTrigger>
        </TabsList>
        <TabsContent value="PASSENGER" className="space-y-3 pt-3">
          <Label htmlFor="seats">Nombre de places</Label>
          <Input
            id="seats"
            type="number"
            min={1}
            max={availableSeats}
            value={seats}
            onChange={(event) => setSeats(Number(event.target.value))}
          />
        </TabsContent>
        <TabsContent value="PARCEL" className="space-y-3 pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="title">Contenu du colis</Label>
            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Taille</Label>
            <Select value={size} onValueChange={(value) => setSize(value as ParcelSize)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PARCEL_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              type="number"
              min={0.1}
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rname">Destinataire</Label>
            <Input
              id="rname"
              value={recipientName}
              onChange={(event) => setRecipientName(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rphone">Téléphone du destinataire</Label>
            <Input
              id="rphone"
              value={recipientPhone}
              onChange={(event) => setRecipientPhone(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="photo">Photo de l&apos;état du colis</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
            />
          </div>
        </TabsContent>
      </Tabs>
      <Button className="w-full" onClick={onSubmit} disabled={loading}>
        {loading ? "Envoi…" : "Demander la réservation"}
      </Button>
    </div>
  );
}
