"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { estimerPrixColis } from "@livre-moi/shared/pricing";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { publishParcel, updateParcel } from "@/lib/actions/parcels";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { GeoPoint, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEIGHT_MIN = 0.5;
const WEIGHT_MAX = 30;
const WEIGHT_STEP = 0.5;

const cad = new Intl.NumberFormat("fr-CA", {
  style: "currency",
  currency: "CAD",
});

export type PublishParcelDefaults = {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  size: ParcelSize | null;
  weight: number;
  fragile: boolean;
  date: string;
  price?: number;
  distance?: number;
  title?: string;
  description?: string;
  recipientName?: string;
  recipientPhone?: string;
};

function FieldSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

export function PublishParcelForm({
  defaults,
  loggedIn,
  listingId,
}: {
  defaults: PublishParcelDefaults;
  loggedIn: boolean;
  listingId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<GeoPoint | null>(defaults.origin);
  const [destination, setDestination] = useState<GeoPoint | null>(
    defaults.destination,
  );
  const [size, setSize] = useState<ParcelSize | null>(defaults.size);
  const [weight, setWeight] = useState(defaults.weight);
  const [fragile, setFragile] = useState(defaults.fragile);
  const [date, setDate] = useState(defaults.date);
  const [title, setTitle] = useState(defaults.title ?? "");
  const [description, setDescription] = useState(defaults.description ?? "");
  const [recipientName, setRecipientName] = useState(defaults.recipientName ?? "");
  const [recipientPhone, setRecipientPhone] = useState(defaults.recipientPhone ?? "");
  const [loading, setLoading] = useState(false);

  const selectedFormat = PARCEL_FORMATS.find((format) => format.value === size);
  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const estimatedPrice = useMemo(() => {
    if (defaults.distance == null) return defaults.price ?? null;
    return estimerPrixColis(defaults.distance, weight).prixClient;
  }, [defaults.distance, defaults.price, weight]);

  const priceLabel =
    estimatedPrice == null ? null : cad.format(estimatedPrice);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!loggedIn) {
      router.push(`/connexion?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    if (!origin || !destination) {
      toast.error("Choisissez un départ et une destination dans la liste.");
      return;
    }
    if (!size) {
      toast.error("Choisissez un format de colis.");
      return;
    }

    setLoading(true);
    const payload = {
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationName: destination.name,
      destLat: destination.lat,
      destLng: destination.lng,
      parcelSize: size,
      weightKg: weight,
      isFragile: fragile,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      estimatedPrice: estimatedPrice ?? undefined,
      distanceKm: defaults.distance,
      desiredDate: date || undefined,
      recipientName: recipientName.trim() || undefined,
      recipientPhone: recipientPhone.trim() || undefined,
    };
    const result = listingId
      ? await updateParcel(listingId, payload)
      : await publishParcel(payload);
    setLoading(false);

    if (!result.ok) {
      if (result.error.includes("Connectez-vous")) {
        router.push(`/connexion?next=${encodeURIComponent(nextPath)}`);
        return;
      }
      toast.error(result.error);
      return;
    }

    toast.success(listingId ? "Colis mis à jour." : "Colis publié.");
    router.push(`/colis/${result.data.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {priceLabel ? (
        <p className="rounded-2xl bg-[#F6F6F6] px-4 py-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          Prix estimé :{" "}
          <span className="font-semibold text-black dark:text-white">
            {priceLabel}
          </span>
          {defaults.distance != null
            ? ` · ${defaults.distance.toLocaleString("fr-CA")} km`
            : ""}
        </p>
      ) : null}

      <FieldSection title="Format du colis">
        <div
          className="grid grid-cols-4 gap-3"
          role="group"
          aria-label="Format du colis"
        >
          {PARCEL_FORMATS.map(({ size: formatSize, value, icon: Icon }) => {
            const selected = size === value;
            return (
              <div key={value} className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  aria-label={`Format ${formatSize}`}
                  aria-pressed={selected}
                  onClick={() => setSize(value)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    selected
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-[#F6F6F6] text-black hover:bg-[#EDEDED] dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </button>
                {selected ? (
                  <span className="rounded-full bg-[#F3F3F3] px-3 py-1 text-center text-xs font-semibold whitespace-nowrap text-black dark:bg-white/10 dark:text-neutral-300">
                    Format {formatSize}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        {selectedFormat ? (
          <p className="text-sm font-semibold leading-snug text-black dark:text-white">
            {selectedFormat.label}
          </p>
        ) : null}
        <label
          htmlFor="pub-fragile"
          className="inline-flex w-fit cursor-pointer items-center gap-2.5 text-sm font-medium text-black dark:text-white"
        >
          <Checkbox
            id="pub-fragile"
            checked={fragile}
            onCheckedChange={(checked) => setFragile(checked === true)}
          />
          Colis fragile
        </label>
      </FieldSection>

      <FieldSection title="Adresse de départ">
        <AddressAutocomplete
          id="pub-origin"
          placeholder="Ville ou adresse de départ…"
          value={origin}
          onChange={setOrigin}
          variant="gooey"
        />
      </FieldSection>

      <FieldSection title="Adresse de destination">
        <AddressAutocomplete
          id="pub-dest"
          placeholder="Ville ou adresse d'arrivée…"
          value={destination}
          onChange={setDestination}
          variant="gooey"
        />
      </FieldSection>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldSection title="Poids">
          <p className="text-2xl font-bold tracking-tight text-black dark:text-white">
            {weight.toLocaleString("fr-CA", { maximumFractionDigits: 1 })} kg
          </p>
          <input
            id="pub-weight"
            type="range"
            min={WEIGHT_MIN}
            max={WEIGHT_MAX}
            step={WEIGHT_STEP}
            value={weight}
            aria-label="Poids du colis"
            onChange={(event) => setWeight(Number(event.target.value))}
            className="parcel-weight-slider mt-1 w-full cursor-pointer appearance-none bg-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, #000 ${((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%, #E8E8E8 ${((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100}%)`,
            }}
          />
        </FieldSection>
        <div className="space-y-2.5">
          <Label htmlFor="pub-date" className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Date souhaitée
          </Label>
          <Input
            id="pub-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="pub-title">Titre de l&apos;annonce</Label>
        <Input
          id="pub-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex. Carton de livres vers Québec"
          className="h-12 rounded-xl"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="pub-desc">Description (optionnel)</Label>
        <Textarea
          id="pub-desc"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Contenu, contraintes d'horaire, point de rencontre…"
          rows={4}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="pub-recipient">Destinataire (optionnel)</Label>
          <Input
            id="pub-recipient"
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="pub-phone">Téléphone destinataire</Label>
          <Input
            id="pub-phone"
            type="tel"
            value={recipientPhone}
            onChange={(event) => setRecipientPhone(event.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-brand w-full disabled:opacity-50">
        {loading
          ? listingId
            ? "Enregistrement…"
            : "Publication…"
          : loggedIn
            ? listingId
              ? "Enregistrer les modifications"
              : "Publier le colis"
            : "Se connecter pour publier"}
      </button>
    </form>
  );
}
