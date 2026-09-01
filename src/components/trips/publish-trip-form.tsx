"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { publishTrip } from "@/lib/actions/trips";
import { CORRIDOR_CITIES, PARCEL_LABELS } from "@/lib/constants";
import type { GeoPoint, ParcelSize } from "@/lib/types";

const steps = ["Itinéraire", "Places", "Colis"];

export function PublishTripForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [departureTime, setDepartureTime] = useState("");
  const [stopsText, setStopsText] = useState("");
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(45);
  const [acceptsParcels, setAcceptsParcels] = useState(true);
  const [maxParcelSize, setMaxParcelSize] = useState<ParcelSize>("MEDIUM");
  const [parcelBasePrice, setParcelBasePrice] = useState(15);
  const [parcelPricePerKg, setParcelPricePerKg] = useState(0);
  const [smoking, setSmoking] = useState(false);
  const [pets, setPets] = useState(false);

  async function onSubmit() {
    if (!origin || !destination || !departureTime) {
      toast.error("Complétez l'origine, la destination et l'heure de départ.");
      return;
    }
    setLoading(true);
    const result = await publishTrip({
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationName: destination.name,
      destLat: destination.lat,
      destLng: destination.lng,
      departureTime,
      totalSeats,
      pricePerSeat,
      acceptsParcels,
      maxParcelSize,
      parcelBasePrice,
      parcelPricePerKg,
      intermediateStops: stopsText
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name, index) => {
          const known = CORRIDOR_CITIES.find(
            (city) => city.name.toLowerCase() === name.toLowerCase(),
          );
          return {
            name: known?.name ?? name,
            lat: known?.lat ?? origin.lat,
            lng: known?.lng ?? origin.lng,
            stop_order: index + 1,
          };
        }),
      preferences: { smoking, pets, luggage: "MEDIUM" },
    });
    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Trajet publié.");
    router.push(`/trajets/${result.data.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-sm">
        {steps.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(index)}
            className={index === step ? "font-semibold text-primary" : "text-muted-foreground"}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div className="grid gap-4">
          <AddressAutocomplete id="pub-origin" label="Départ" value={origin} onChange={setOrigin} />
          <AddressAutocomplete
            id="pub-dest"
            label="Arrivée"
            value={destination}
            onChange={setDestination}
          />
          <div className="space-y-1.5">
            <Label htmlFor="when">Date et heure de départ</Label>
            <Input
              id="when"
              type="datetime-local"
              value={departureTime}
              onChange={(event) => setDepartureTime(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stops">Arrêts intermédiaires (optionnel, séparés par des virgules)</Label>
            <Input
              id="stops"
              placeholder="Louvicourt, Mont-Laurier, Maniwaki"
              value={stopsText}
              onChange={(event) => setStopsText(event.target.value)}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="seats">Places passagers</Label>
            <Input
              id="seats"
              type="number"
              min={0}
              max={8}
              value={totalSeats}
              onChange={(event) => setTotalSeats(Number(event.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="price">Prix par place ($ CAD)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step="0.5"
              value={pricePerSeat}
              onChange={(event) => setPricePerSeat(Number(event.target.value))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={smoking} onCheckedChange={(value) => setSmoking(Boolean(value))} />
            Fumeur accepté
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={pets} onCheckedChange={(value) => setPets(Boolean(value))} />
            Animaux acceptés
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Accepter des colis</p>
              <p className="text-sm text-muted-foreground">
                Cotransportage sur le même trajet, validé par code OTP.
              </p>
            </div>
            <Switch checked={acceptsParcels} onCheckedChange={setAcceptsParcels} />
          </div>
          {acceptsParcels && (
            <>
              <div className="space-y-1.5">
                <Label>Taille maximale</Label>
                <Select
                  value={maxParcelSize}
                  onValueChange={(value) => setMaxParcelSize(value as ParcelSize)}
                >
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="parcel-base">Prix de base colis ($)</Label>
                  <Input
                    id="parcel-base"
                    type="number"
                    min={0}
                    value={parcelBasePrice}
                    onChange={(event) => setParcelBasePrice(Number(event.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="parcel-kg">Supplément / kg ($)</Label>
                  <Input
                    id="parcel-kg"
                    type="number"
                    min={0}
                    step="0.1"
                    value={parcelPricePerKg}
                    onChange={(event) => setParcelPricePerKg(Number(event.target.value))}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Retour
        </Button>
        {step < 2 ? (
          <Button type="button" onClick={() => setStep(step + 1)}>
            Continuer
          </Button>
        ) : (
          <Button type="button" onClick={onSubmit} disabled={loading}>
            {loading ? "Publication…" : "Publier le trajet"}
          </Button>
        )}
      </div>
    </div>
  );
}
