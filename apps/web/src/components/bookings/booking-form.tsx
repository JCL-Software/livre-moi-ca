"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button, KIND, SIZE } from "baseui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { createBooking } from "@/lib/actions/bookings";
import { PARCEL_LABELS } from "@/lib/constants";
import type { BookingType, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatPrixCad } from "@livre-moi/shared/pricing";

type Props = {
  tripId: string;
  availableSeats: number;
  pricePerSeat: number;
  acceptsParcels: boolean;
  parcelBasePrice: number;
  loggedIn: boolean;
};

const FIELD =
  "h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 text-base font-medium text-black outline-none focus:ring-2 focus:ring-black";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: string;
}) {
  return (
    <label htmlFor={htmlFor} className="uber-home-kicker mb-1.5 block">
      {children}
    </label>
  );
}

export function BookingForm({
  tripId,
  availableSeats,
  pricePerSeat,
  acceptsParcels,
  parcelBasePrice,
  loggedIn,
}: Props) {
  const router = useRouter();
  const [type, setType] = useState<BookingType>(
    availableSeats > 0 ? "PASSENGER" : "PARCEL",
  );
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
    router.push("/compte/voyages");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-[#F6F6F6] p-1.5">
        <button
          type="button"
          disabled={availableSeats < 1}
          onClick={() => setType("PASSENGER")}
          className={cn(
            "rounded-md px-3 py-2.5 text-sm font-medium disabled:opacity-40",
            type === "PASSENGER" ? "bg-white text-black" : "text-[#545454]",
          )}
        >
          Place · {formatPrixCad(pricePerSeat)}
        </button>
        <button
          type="button"
          disabled={!acceptsParcels}
          onClick={() => setType("PARCEL")}
          className={cn(
            "rounded-md px-3 py-2.5 text-sm font-medium disabled:opacity-40",
            type === "PARCEL" ? "bg-white text-black" : "text-[#545454]",
          )}
        >
          Colis · dès {formatPrixCad(parcelBasePrice)}
        </button>
      </div>

      {type === "PASSENGER" ? (
        <div>
          <FieldLabel>Nombre de places</FieldLabel>
          <div className="flex items-center justify-between rounded-lg bg-[#EEEEEE] px-3 py-2">
            <button
              type="button"
              aria-label="Diminuer"
              disabled={seats <= 1}
              onClick={() => setSeats(seats - 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
            >
              <Minus className="h-4 w-4" aria-hidden />
            </button>
            <p className="uber-price m-0">{seats}</p>
            <button
              type="button"
              aria-label="Augmenter"
              disabled={seats >= availableSeats}
              onClick={() => setSeats(seats + 1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <FieldLabel htmlFor="booking-title">Contenu du colis</FieldLabel>
            <input
              id="booking-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={FIELD}
            />
          </div>
          <div>
            <FieldLabel htmlFor="booking-desc">Description</FieldLabel>
            <textarea
              id="booking-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-lg border-0 bg-[#EEEEEE] px-4 py-3 text-base font-medium text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <FieldLabel htmlFor="booking-size">Taille</FieldLabel>
            <select
              id="booking-size"
              value={size}
              onChange={(event) => setSize(event.target.value as ParcelSize)}
              className={FIELD}
            >
              {Object.entries(PARCEL_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="booking-weight">Poids (kg)</FieldLabel>
            <input
              id="booking-weight"
              type="number"
              min={0.1}
              step="0.1"
              value={weight}
              onChange={(event) => setWeight(Number(event.target.value))}
              className={FIELD}
            />
          </div>
          <div>
            <FieldLabel htmlFor="booking-rname">Destinataire</FieldLabel>
            <input
              id="booking-rname"
              value={recipientName}
              onChange={(event) => setRecipientName(event.target.value)}
              className={FIELD}
            />
          </div>
          <div>
            <FieldLabel htmlFor="booking-rphone">Téléphone du destinataire</FieldLabel>
            <input
              id="booking-rphone"
              value={recipientPhone}
              onChange={(event) => setRecipientPhone(event.target.value)}
              className={FIELD}
            />
          </div>
          <div>
            <FieldLabel htmlFor="booking-photo">Photo de l’état du colis</FieldLabel>
            <input
              id="booking-photo"
              type="file"
              accept="image/*"
              onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[#545454] file:mr-3 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white"
            />
          </div>
        </div>
      )}

      <Button
        kind={KIND.primary}
        size={SIZE.large}
        onClick={onSubmit}
        disabled={loading}
        overrides={{ BaseButton: { style: { width: "100%" } } }}
      >
        {loading ? "Envoi…" : "Demander la réservation"}
      </Button>
      <p className="m-0 text-xs leading-relaxed text-[#545454]">
        Le tarif est affiché avant la réservation. Le paiement se fait en ligne.
      </p>
    </div>
  );
}
