"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Calculator, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { estimerPrixColis } from "@livre-moi/shared/pricing";
import {
  normalizeRegion,
  parseAddressName,
  publicStreetName,
} from "@livre-moi/shared/geo";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import { GOOEY_INPUT_TRANSITION } from "@/components/ui/gooey-input";
import { UberButtonLink } from "@/components/baseweb/uber-button-link";
import { UberCalendarField } from "@/components/baseweb/uber-calendar";
import { UberCard } from "@/components/baseweb/uber-ui";
import { KIND, SIZE } from "baseui/button";
import { ParcelCard } from "@/components/parcels/parcel-card";
import { shortPlace } from "@/lib/account-format";
import { PARCEL_CATEGORIES, PARCEL_CATEGORY_LABELS } from "@/lib/constants";
import { publishParcel, updateParcel } from "@/lib/actions/parcels";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import {
  PARCEL_LISTING_PHOTO_BUCKET,
  PARCEL_PHOTO_MAX_BYTES,
  parcelListingPhotoUrl,
  parcelPhotoExtension,
} from "@/lib/parcel-photo";
import { createClient } from "@/lib/supabase/client";
import type { GeoPoint, ParcelCategory, ParcelListing, ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 100;
const WEIGHT_STEP = 0.5;
const WEIGHT_TICKS = [0, 20, 40, 60, 80, 100];

const UBER_INPUT =
  "h-14 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 text-base font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black";

const UBER_SUB_INPUT =
  "h-12 w-full rounded-lg border-0 bg-[#EEEEEE] px-4 text-[15px] font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black";

const REGIONS = ["Québec", "Ontario"] as const;
const COUNTRIES = ["Canada"] as const;
const UBER_FIELD_SHIFT = 64;

type AddressDetails = {
  unit: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};

function emptyDetails(unit = ""): AddressDetails {
  return {
    unit,
    city: "",
    region: "",
    postalCode: "",
    country: "Canada",
  };
}

function detailsFromPoint(point: GeoPoint | null, unit = ""): AddressDetails {
  if (!point) return emptyDetails(unit);
  const parsed = parseAddressName(point.name);
  return {
    unit: point.unit?.trim() || unit,
    city: point.city?.trim() || parsed.city || "",
    region: normalizeRegion(point.region?.trim() || parsed.region || ""),
    postalCode: point.postalCode?.trim() || parsed.postalCode || "",
    country: point.country?.trim() || parsed.country || "Canada",
  };
}

function composeFullAddress(pointName: string, details: AddressDetails) {
  const street = pointName.split(",")[0]?.trim() || pointName.trim();
  const line = details.unit.trim()
    ? `${street}, app. ${details.unit.trim()}`
    : street;
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const part of [
    line,
    details.city.trim(),
    details.region.trim(),
    details.postalCode.trim(),
    details.country.trim(),
  ]) {
    const key = part.toLowerCase();
    if (!part || seen.has(key)) continue;
    seen.add(key);
    parts.push(part);
  }
  return parts.join(", ");
}

const STEPS = [
  {
    id: 0,
    label: "Trajet",
    title: "Trajet et date",
    subtitle: "Indiquez le départ, l’arrivée et le moment souhaité.",
  },
  {
    id: 1,
    label: "Colis",
    title: "Votre colis",
    subtitle: "Choisissez le format, le type et le poids.",
  },
  {
    id: 2,
    label: "Détails",
    title: "Détails de l’annonce",
    subtitle: "Une photo et un titre aident les conducteurs à vous choisir.",
  },
  {
    id: 3,
    label: "Destinataire",
    title: "Destinataire",
    subtitle:
      "Adresse complète, nom et téléphone — Visibles uniquement par le conducteur retenu.",
  },
  {
    id: 4,
    label: "Confirmation",
    title: "Confirmez et publiez",
    subtitle:
      "Vérifiez l’annonce publique. Les détails de remise restent privés.",
  },
] as const;

export type PublishParcelDefaults = {
  origin: GeoPoint | null;
  destination: GeoPoint | null;
  size: ParcelSize | null;
  category?: ParcelCategory;
  categoryDetail?: string;
  weight: number;
  fragile: boolean;
  date: string;
  price?: number;
  distance?: number;
  title?: string;
  description?: string;
  recipientFirstName?: string;
  recipientLastName?: string;
  recipientName?: string;
  recipientPhone?: string;
  originUnit?: string;
  destUnit?: string;
  destAddress?: string;
  meetingPoint?: string;
  photoUrl?: string | null;
};

function FieldLabel({
  htmlFor,
  children,
  className,
  shift,
}: {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  shift?: boolean;
}) {
  if (shift === undefined) {
    return (
      <label
        htmlFor={htmlFor}
        className={cn("uber-home-kicker mb-0 block pb-1.5", className)}
      >
        {children}
      </label>
    );
  }

  return (
    <motion.label
      htmlFor={htmlFor}
      className={cn("uber-home-kicker mb-0 block pb-1.5", className)}
      initial={false}
      animate={{ paddingLeft: shift ? UBER_FIELD_SHIFT : 0 }}
      transition={GOOEY_INPUT_TRANSITION}
    >
      {children}
    </motion.label>
  );
}

function AddressDetailsFields({
  idPrefix,
  details,
  onChange,
}: {
  idPrefix: string;
  details: AddressDetails;
  onChange: (next: AddressDetails) => void;
}) {
  const regions = Array.from(
    new Set([...REGIONS, details.region].filter(Boolean)),
  );
  const countries = Array.from(
    new Set([...COUNTRIES, details.country].filter(Boolean)),
  );

  return (
    <div className="mt-3 space-y-3">
      <div>
        <FieldLabel htmlFor={`${idPrefix}-unit`}>
          Appartement, unité ou bureau (optionnel)
        </FieldLabel>
        <input
          id={`${idPrefix}-unit`}
          value={details.unit}
          onChange={(event) =>
            onChange({ ...details, unit: event.target.value })
          }
          placeholder="Ex. 12B"
          maxLength={40}
          className={UBER_SUB_INPUT}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-city`}>Ville *</FieldLabel>
          <input
            id={`${idPrefix}-city`}
            value={details.city}
            onChange={(event) =>
              onChange({ ...details, city: event.target.value })
            }
            placeholder="Ville"
            maxLength={80}
            required
            className={UBER_SUB_INPUT}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-country`}>Pays *</FieldLabel>
          <select
            id={`${idPrefix}-country`}
            value={details.country}
            onChange={(event) =>
              onChange({ ...details, country: event.target.value })
            }
            required
            className={UBER_SUB_INPUT}
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={`${idPrefix}-region`}>Province / région</FieldLabel>
          <select
            id={`${idPrefix}-region`}
            value={details.region}
            onChange={(event) =>
              onChange({ ...details, region: event.target.value })
            }
            className={UBER_SUB_INPUT}
          >
            <option value="">À préciser</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor={`${idPrefix}-postal`}>Code postal</FieldLabel>
          <input
            id={`${idPrefix}-postal`}
            value={details.postalCode}
            onChange={(event) =>
              onChange({ ...details, postalCode: event.target.value })
            }
            placeholder="Ex. H2X 1Y4"
            maxLength={10}
            autoComplete="postal-code"
            className={UBER_SUB_INPUT}
          />
        </div>
      </div>
    </div>
  );
}

function formatWeight(kg: number) {
  return `${kg.toLocaleString("fr-CA", { maximumFractionDigits: 1 })} kg`;
}

function splitDesiredDate(value: string) {
  if (!value) return { date: "", time: "" };
  const [day, clock] = value.split("T");
  return {
    date: day?.slice(0, 10) ?? "",
    time: clock?.slice(0, 5) ?? "",
  };
}

function formatDateLabel(value: string) {
  if (!value) return "À choisir";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("fr-CA", {
    dateStyle: "medium",
    timeZone: "UTC",
  });
}

function formatTimeLabel(value: string) {
  if (!value) return "Non renseignée";
  const [hours, minutes] = value.split(":");
  if (hours == null || minutes == null) return value;
  return `${Number(hours)} h ${minutes}`;
}

function Stepper({
  current,
  reached,
  onSelect,
}: {
  current: number;
  reached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2" aria-label="Étapes de publication">
      {STEPS.map((item, index) => {
        const active = index === current;
        const done = index < current;
        const enabled = index <= reached;
        return (
          <li key={item.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <button
              type="button"
              disabled={!enabled}
              onClick={() => onSelect(index)}
              className={cn(
                "flex min-w-0 items-center gap-2 rounded-full px-0.5 py-1 text-left sm:px-1",
                enabled ? "cursor-pointer" : "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  active || done
                    ? "bg-black text-white"
                    : "bg-[#EEEEEE] text-[#545454]",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-sm font-semibold",
                  active ? "text-black" : "hidden text-[#545454] sm:inline",
                )}
              >
                {item.label}
              </span>
            </button>
            {index < STEPS.length - 1 ? (
              <span
                className={cn(
                  "hidden h-px min-w-3 flex-1 sm:block",
                  done ? "bg-black" : "bg-[#EEEEEE]",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function RecapSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <p className="uber-home-kicker m-0">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-black hover:underline"
        >
          Modifier
        </button>
      </div>
      {children}
    </div>
  );
}

function RecapValue({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center rounded-lg bg-[#EEEEEE] px-4 py-3 text-base font-medium break-words text-black",
        className,
      )}
    >
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
  const initialStep = (() => {
    const raw = Number(searchParams.get("step"));
    if (Number.isInteger(raw) && raw >= 0 && raw < STEPS.length) return raw;
    if (defaults.price != null || defaults.distance != null) return 1;
    return 0;
  })();
  const [step, setStep] = useState(initialStep);
  const [reached, setReached] = useState(initialStep);
  const [stepError, setStepError] = useState("");
  const [origin, setOrigin] = useState<GeoPoint | null>(defaults.origin);
  const [destination, setDestination] = useState<GeoPoint | null>(
    defaults.destination,
  );
  const [originOpen, setOriginOpen] = useState(() => Boolean(defaults.origin));
  const [destOpen, setDestOpen] = useState(() => Boolean(defaults.destination));
  const [activeDetails, setActiveDetails] = useState<"origin" | "dest" | null>(
    () => (defaults.origin ? "origin" : defaults.destination ? "dest" : null),
  );
  const [size, setSize] = useState<ParcelSize | null>(defaults.size);
  const [category, setCategory] = useState<ParcelCategory>(
    defaults.category ?? "PARCEL",
  );
  const [categoryOther, setCategoryOther] = useState(
    defaults.category === "OTHER" ? (defaults.categoryDetail ?? "") : "",
  );
  const [weight, setWeight] = useState(defaults.weight);
  const [fragile, setFragile] = useState(defaults.fragile);
  const initialDesired = splitDesiredDate(defaults.date);
  const [date, setDate] = useState(initialDesired.date);
  const [time, setTime] = useState(initialDesired.time);
  const [title, setTitle] = useState(defaults.title ?? "");
  const [description, setDescription] = useState(defaults.description ?? "");
  const [originDetails, setOriginDetails] = useState<AddressDetails>(() =>
    detailsFromPoint(defaults.origin, defaults.originUnit),
  );
  const [destDetails, setDestDetails] = useState<AddressDetails>(() =>
    detailsFromPoint(defaults.destination, defaults.destUnit),
  );
  const initialDestAddress =
    defaults.destAddress?.trim() ||
    composeFullAddress(
      defaults.destination?.name ?? "",
      detailsFromPoint(defaults.destination, defaults.destUnit),
    );
  const [destAddress, setDestAddress] = useState(initialDestAddress);
  const [destAddressManual, setDestAddressManual] = useState(
    Boolean(
      defaults.destAddress?.trim() &&
        defaults.destAddress.trim() !==
          composeFullAddress(
            defaults.destination?.name ?? "",
            detailsFromPoint(defaults.destination, defaults.destUnit),
          ),
    ),
  );
  const [recipientFirstName, setRecipientFirstName] = useState(
    defaults.recipientFirstName ?? defaults.recipientName ?? "",
  );
  const [recipientLastName, setRecipientLastName] = useState(
    defaults.recipientLastName ?? "",
  );
  const [recipientPhone, setRecipientPhone] = useState(defaults.recipientPhone ?? "");
  const [meetingPoint, setMeetingPoint] = useState(defaults.meetingPoint ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPath, setPhotoPath] = useState<string | null>(defaults.photoUrl ?? null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step !== 0) return;
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target;
      if (!(node instanceof Element)) {
        setActiveDetails(null);
        return;
      }
      const block = node.closest("[data-address-block]");
      const which = block?.getAttribute("data-address-block");
      if (which === "origin" || which === "dest") {
        setActiveDetails(which);
        return;
      }
      setActiveDetails(null);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [step]);

  useEffect(() => {
    if (destAddressManual) return;
    setDestAddress(
      composeFullAddress(destination?.name ?? "", destDetails),
    );
  }, [destination?.name, destDetails, destAddressManual]);

  useEffect(() => {
    if (!photoFile) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const photoPreview = localPreview ?? parcelListingPhotoUrl(photoPath);

  const selectedFormat = PARCEL_FORMATS.find((format) => format.value === size);
  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const weightPct = ((weight - WEIGHT_MIN) / (WEIGHT_MAX - WEIGHT_MIN)) * 100;
  const currentStep = STEPS[step];

  const estimatedPrice = useMemo(() => {
    if (defaults.distance == null) return defaults.price ?? null;
    return estimerPrixColis(
      defaults.distance,
      weight,
      size ?? "SMALL",
    ).prixClient;
  }, [defaults.distance, defaults.price, size, weight]);

  const previewListing = useMemo<ParcelListing>(() => {
    const originName = publicStreetName(origin?.name ?? "Prise en charge");
    const destinationName = publicStreetName(
      destination?.name ?? "Destination",
    );
    return {
      id: listingId ?? "preview",
      user_id: "",
      title: title.trim() || "Titre de l'annonce",
      description: description.trim() || null,
      origin_name: originName,
      destination_name: destinationName,
      parcel_size: size ?? "MEDIUM",
      category,
      category_detail:
        category === "OTHER" ? categoryOther.trim() || null : null,
      weight_kg: weight,
      is_fragile: fragile,
      estimated_price: estimatedPrice,
      distance_km: defaults.distance ?? null,
      desired_date: date ? date.slice(0, 10) : null,
      photo_url: photoPath,
      status: "OPEN",
      created_at: new Date().toISOString(),
    };
  }, [
    listingId,
    title,
    description,
    origin,
    destination,
    size,
    category,
    categoryOther,
    weight,
    fragile,
    estimatedPrice,
    defaults.distance,
    date,
    photoPath,
  ]);

  function stepMessage(index: number) {
    if (index >= 1 && (!origin || !destination || !date)) {
      return "Choisissez un départ, une destination et une date.";
    }
    if (index >= 2 && !size) {
      return "Choisissez un format de colis.";
    }
    return "";
  }

  function goTo(next: number) {
    const message = stepMessage(next);
    if (message) {
      setStepError(message);
      toast.error(message);
      return;
    }
    setStepError("");
    setStep(next);
    setReached((current) => Math.max(current, next));
  }

  function onPickPhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez une image (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > PARCEL_PHOTO_MAX_BYTES) {
      toast.error("La photo doit faire moins de 8 Mo.");
      return;
    }
    setPhotoFile(file);
  }

  async function uploadPhotoIfNeeded(): Promise<string | null> {
    if (!photoFile) return photoPath;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Connectez-vous pour publier un colis.");
    }
    const path = `${user.id}/${Date.now()}.${parcelPhotoExtension(photoFile)}`;
    const { error } = await supabase.storage
      .from(PARCEL_LISTING_PHOTO_BUCKET)
      .upload(path, photoFile, {
        contentType: photoFile.type || "image/jpeg",
        upsert: false,
      });
    if (error) {
      throw new Error("Échec du téléversement de la photo.");
    }
    setPhotoPath(path);
    return path;
  }

  async function publish() {
    if (!loggedIn) {
      router.push(`/connexion?next=${encodeURIComponent(nextPath)}`);
      return;
    }
    const message = stepMessage(4);
    if (message) {
      toast.error(message);
      setStep(message.includes("format") ? 1 : 0);
      return;
    }
    if (!origin || !destination || !size) return;

    setLoading(true);
    let uploadedPhotoUrl: string | null;
    try {
      uploadedPhotoUrl = await uploadPhotoIfNeeded();
    } catch (error) {
      setLoading(false);
      toast.error(
        error instanceof Error ? error.message : "Échec du téléversement de la photo.",
      );
      return;
    }

    const payload = {
      originName: origin.name,
      originLat: origin.lat,
      originLng: origin.lng,
      destinationName: destination.name,
      destLat: destination.lat,
      destLng: destination.lng,
      parcelSize: size,
      category,
      categoryDetail:
        category === "OTHER" ? categoryOther.trim() || undefined : undefined,
      weightKg: weight,
      isFragile: fragile,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      estimatedPrice: estimatedPrice ?? undefined,
      distanceKm: defaults.distance,
      desiredDate: date ? date.slice(0, 10) : undefined,
      originUnit: originDetails.unit.trim() || undefined,
      originAddress: composeFullAddress(origin.name, originDetails) || undefined,
      destUnit: destDetails.unit.trim() || undefined,
      destAddress: destAddress.trim() || undefined,
      recipientFirstName: recipientFirstName.trim() || undefined,
      recipientLastName: recipientLastName.trim() || undefined,
      recipientPhone: recipientPhone.trim() || undefined,
      meetingPoint: meetingPoint.trim() || undefined,
      photoUrl: uploadedPhotoUrl,
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

  function onFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    void publish();
  }

  const submitLabel = loading
    ? listingId
      ? "Enregistrement…"
      : "Publication…"
    : loggedIn
      ? listingId
        ? "Enregistrer les modifications"
        : "Publier le colis"
      : "Se connecter pour publier";

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <UberCard>
        <form onSubmit={onFormSubmit}>
          <Stepper current={step} reached={reached} onSelect={goTo} />

          <div className="mt-6 mb-5">
            <h2 className="uber-section-title">
              {currentStep.title}
            </h2>
            <p className="uber-section-lead mt-1">
              {currentStep.subtitle}
            </p>
          </div>

          <div className="space-y-5">
            {step === 0 ? (
              <>
                <div className="relative">
                  <div data-address-block="origin">
                    <FieldLabel htmlFor="pub-origin" shift={originOpen}>
                      Prise en charge
                    </FieldLabel>
                    <AddressAutocomplete
                      id="pub-origin"
                      placeholder="Lieu de prise en charge"
                      value={origin}
                      onChange={(value) => {
                        setOrigin(value);
                        setOriginDetails(detailsFromPoint(value, originDetails.unit));
                        if (value) setActiveDetails("origin");
                        setStepError("");
                      }}
                      onOpenChange={setOriginOpen}
                      onFocus={() => setActiveDetails("origin")}
                      variant="uber"
                      locate
                    />
                    <AnimatePresence initial={false}>
                      {origin && activeDetails === "origin" ? (
                        <motion.div
                          key="origin-details"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            paddingLeft: originOpen ? UBER_FIELD_SHIFT : 0,
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                          <AddressDetailsFields
                            idPrefix="pub-origin"
                            details={originDetails}
                            onChange={setOriginDetails}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                  <div className="relative box-content h-9 py-4">
                    <div className="pointer-events-none absolute left-0 top-1/2 z-20 flex h-9 w-14 -translate-y-1/2 items-center justify-center">
                      <button
                        type="button"
                        aria-label="Inverser origine et destination"
                        onClick={() => {
                          setOrigin(destination);
                          setDestination(origin);
                          setOriginDetails(destDetails);
                          setDestDetails(originDetails);
                          setDestAddressManual(false);
                        }}
                        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#EEEEEE] text-black shadow-sm hover:bg-[#E4E4E4]"
                      >
                        <ArrowUpDown className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <div data-address-block="dest">
                    <FieldLabel htmlFor="pub-dest" shift={destOpen}>
                      Destination
                    </FieldLabel>
                    <AddressAutocomplete
                      id="pub-dest"
                      placeholder="Destination"
                      value={destination}
                      onChange={(value) => {
                        setDestination(value);
                        setDestDetails(detailsFromPoint(value, destDetails.unit));
                        setDestAddressManual(false);
                        if (value) setActiveDetails("dest");
                        setStepError("");
                      }}
                      onOpenChange={setDestOpen}
                      onFocus={() => setActiveDetails("dest")}
                      variant="uber"
                    />
                    <AnimatePresence initial={false}>
                      {destination && activeDetails === "dest" ? (
                        <motion.div
                          key="dest-details"
                          className="overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            paddingLeft: destOpen ? UBER_FIELD_SHIFT : 0,
                          }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                          <AddressDetailsFields
                            idPrefix="pub-dest"
                            details={destDetails}
                            onChange={(next) => {
                              setDestDetails(next);
                              setDestAddressManual(false);
                            }}
                          />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
                <p className="text-[13px] leading-5 text-[#545454]">
                  L’appartement et le code postal n’apparaissent pas sur l’annonce
                  publique.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="pub-date">Date souhaitée</FieldLabel>
                    <UberCalendarField
                      id="pub-date"
                      value={date}
                      onChange={(value) => {
                        setDate(value.slice(0, 10));
                        setStepError("");
                      }}
                      minDate={new Date()}
                      withTime={false}
                      triggerClassName="uber-date text-base font-medium"
                      aria-label="Date souhaitée"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="pub-time">Heure (optionnel)</FieldLabel>
                    <input
                      id="pub-time"
                      type="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className={UBER_INPUT}
                      aria-label="Heure souhaitée, optionnel"
                    />
                  </div>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="rounded-xl border border-[#EEEEEE] bg-[#F6F6F6] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="m-0 flex items-center gap-2 text-sm font-semibold text-black">
                        <Calculator className="h-4 w-4 shrink-0" aria-hidden />
                        Estimer le prix avant de continuer
                      </p>
                      <p className="mt-1 mb-0 text-sm leading-relaxed text-[#545454]">
                        Le calculateur reprend votre trajet pour un prix
                        indicatif, puis vous revient à cette étape.
                      </p>
                    </div>
                    <UberButtonLink
                      href={
                        origin && destination
                          ? `/calculateur?${new URLSearchParams({
                              origin: origin.name,
                              olat: String(origin.lat),
                              olng: String(origin.lng),
                              dest: destination.name,
                              dlat: String(destination.lat),
                              dlng: String(destination.lng),
                              date,
                              ...(time ? { time } : {}),
                              ...(size ? { size } : {}),
                              weight: String(weight),
                              ...(fragile ? { fragile: "1" } : {}),
                              from: "publish",
                            }).toString()}`
                          : "/calculateur?from=publish"
                      }
                      kind={KIND.secondary}
                      size={SIZE.compact}
                      overrides={{
                        BaseButton: {
                          style: {
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          },
                        },
                      }}
                    >
                      Ouvrir l&apos;estimateur
                    </UberButtonLink>
                  </div>
                </div>
                <div>
                  <FieldLabel>Format du colis</FieldLabel>
                  <div className="grid grid-cols-4 gap-2" role="group" aria-label="Format du colis">
                    {PARCEL_FORMATS.map(({ size: formatSize, value, icon: Icon }) => {
                      const selected = size === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-label={`Format ${formatSize}`}
                          aria-pressed={selected}
                          onClick={() => {
                            setSize(value);
                            setStepError("");
                          }}
                          className={cn(
                            "inline-flex h-12 items-center justify-center rounded-lg text-sm font-semibold",
                            selected
                              ? "bg-black text-white"
                              : "bg-[#EEEEEE] text-black hover:bg-[#E4E4E4]",
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                          <span className="sr-only">{formatSize}</span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 mb-0 text-[15px] leading-5 text-[#545454]">
                    {selectedFormat?.label ?? "Choisissez le format qui tient dans le véhicule."}
                  </p>
                </div>
                <div>
                  <FieldLabel>Type de colis</FieldLabel>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Type de colis">
                    {PARCEL_CATEGORIES.map(({ value, label }) => {
                      const selected = category === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setCategory(value);
                            if (value !== "OTHER") setCategoryOther("");
                          }}
                          className={cn(
                            "rounded-lg px-3 py-2.5 text-sm font-medium",
                            selected
                              ? "bg-black text-white"
                              : "bg-[#EEEEEE] text-black hover:bg-[#E4E4E4]",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {category === "OTHER" ? (
                    <div className="mt-3">
                      <FieldLabel htmlFor="pub-category-other">Préciser</FieldLabel>
                      <input
                        id="pub-category-other"
                        type="text"
                        value={categoryOther}
                        onChange={(event) => setCategoryOther(event.target.value)}
                        placeholder="Ex. Instruments de musique"
                        maxLength={80}
                        className={UBER_INPUT}
                      />
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => setFragile((value) => !value)}
                  className={cn(
                    "w-full rounded-lg px-4 py-3 text-left text-sm font-medium",
                    fragile ? "bg-black text-white" : "bg-[#EEEEEE] text-black",
                  )}
                >
                  Colis fragile
                </button>
                <div>
                  <FieldLabel htmlFor="pub-weight">Poids</FieldLabel>
                  <p className="uber-section-title mb-1">
                    {formatWeight(weight)}
                  </p>
                  <input
                    id="pub-weight"
                    type="range"
                    min={WEIGHT_MIN}
                    max={WEIGHT_MAX}
                    step={WEIGHT_STEP}
                    value={weight}
                    aria-label="Poids du colis"
                    aria-valuemin={WEIGHT_MIN}
                    aria-valuemax={WEIGHT_MAX}
                    aria-valuenow={weight}
                    aria-valuetext={formatWeight(weight)}
                    onChange={(event) => setWeight(Number(event.target.value))}
                    className="parcel-weight-slider mt-1 w-full cursor-pointer appearance-none bg-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, #000 ${weightPct}%, #E8E8E8 ${weightPct}%)`,
                    }}
                  />
                  <div
                    className="mt-1 flex justify-between pt-1"
                    style={{ marginLeft: 10, marginRight: 10 }}
                  >
                    {WEIGHT_TICKS.map((tick) => (
                      <button
                        key={tick}
                        type="button"
                        onClick={() => setWeight(tick === 0 ? 0.5 : tick)}
                        className={cn(
                          "whitespace-nowrap text-[11px] font-medium text-[#9A9A9A] transition-colors hover:text-black",
                          (tick === 0 ? weight <= 0.5 : weight === tick) &&
                            "text-black",
                        )}
                      >
                        {tick} kg
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div>
                  <FieldLabel htmlFor="pub-photo">Photo du colis</FieldLabel>
                  {photoPreview ? (
                    <div className="relative overflow-hidden rounded-lg bg-[#EEEEEE]">
                      <img
                        src={photoPreview}
                        alt="Aperçu du colis"
                        className="h-48 w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/55 px-3 py-2">
                        <label
                          htmlFor="pub-photo"
                          className="cursor-pointer text-sm font-medium text-white underline-offset-2 hover:underline"
                        >
                          Changer
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null);
                            setPhotoPath(null);
                            setLocalPreview(null);
                          }}
                          className="inline-flex items-center gap-1 text-sm font-medium text-white"
                        >
                          <X className="h-4 w-4" aria-hidden />
                          Retirer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="pub-photo"
                      className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-[#EEEEEE] px-4 py-6 text-center hover:bg-[#E4E4E4]"
                    >
                      <ImagePlus className="h-6 w-6 text-black" aria-hidden />
                      <span className="text-sm font-semibold text-black">Ajouter une photo</span>
                      <span className="text-[13px] leading-5 text-[#545454]">
                        Optionnel · JPG, PNG ou WebP, 8 Mo max.
                      </span>
                    </label>
                  )}
                  <input
                    id="pub-photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => {
                      onPickPhoto(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pub-title">Titre de l&apos;annonce</FieldLabel>
                  <input
                    id="pub-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex. Carton de livres vers Québec"
                    className={UBER_INPUT}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pub-desc">Description (optionnel)</FieldLabel>
                  <textarea
                    id="pub-desc"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Contenu, contraintes d'horaire, point de rencontre…"
                    rows={4}
                    className="min-h-28 w-full resize-y rounded-lg border-0 bg-[#EEEEEE] px-4 py-3 text-base font-medium text-black outline-none placeholder:text-[#6B6B6B] focus:ring-2 focus:ring-black"
                  />
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <p className="m-0 mb-5 rounded-lg bg-[#F6F6F6] px-4 py-3 text-[13px] leading-5 text-[#545454]">
                Ces informations ne sont pas visibles publiquement. Seul le
                conducteur retenu pour la livraison y aura accès.
              </p>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div>
                  <FieldLabel htmlFor="pub-dest-address">
                    Adresse complète de destination
                  </FieldLabel>
                  <input
                    id="pub-dest-address"
                    value={destAddress}
                    onChange={(event) => {
                      setDestAddress(event.target.value);
                      setDestAddressManual(true);
                    }}
                    placeholder="Rue, numéro, ville"
                    maxLength={300}
                    className={UBER_INPUT}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="pub-recipient-first">Prénom</FieldLabel>
                    <input
                      id="pub-recipient-first"
                      value={recipientFirstName}
                      onChange={(event) =>
                        setRecipientFirstName(event.target.value)
                      }
                      placeholder="Prénom du destinataire"
                      maxLength={80}
                      className={UBER_INPUT}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="pub-recipient-last">Nom</FieldLabel>
                    <input
                      id="pub-recipient-last"
                      value={recipientLastName}
                      onChange={(event) =>
                        setRecipientLastName(event.target.value)
                      }
                      placeholder="Nom du destinataire"
                      maxLength={80}
                      className={UBER_INPUT}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel htmlFor="pub-phone">Téléphone</FieldLabel>
                  <input
                    id="pub-phone"
                    type="tel"
                    value={recipientPhone}
                    onChange={(event) => setRecipientPhone(event.target.value)}
                    placeholder="Numéro du destinataire"
                    maxLength={30}
                    className={UBER_INPUT}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="pub-meeting">
                    Point de rencontre (s’il y a lieu)
                  </FieldLabel>
                  <input
                    id="pub-meeting"
                    value={meetingPoint}
                    onChange={(event) => setMeetingPoint(event.target.value)}
                    placeholder="Ex. Entrée du stationnement, porte arrière"
                    maxLength={200}
                    className={UBER_INPUT}
                  />
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <RecapSection title="Trajet" onEdit={() => goTo(0)}>
                  <div className="space-y-2">
                    <RecapValue>
                      {shortPlace(origin?.name)} → {shortPlace(destination?.name)}
                    </RecapValue>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <RecapValue>{formatDateLabel(date)}</RecapValue>
                      <RecapValue>
                        {time ? formatTimeLabel(time) : "Heure libre"}
                      </RecapValue>
                    </div>
                  </div>
                </RecapSection>
                <RecapSection title="Colis" onEdit={() => goTo(1)}>
                  <RecapValue>
                    {category === "OTHER" && categoryOther.trim()
                      ? categoryOther.trim()
                      : PARCEL_CATEGORY_LABELS[category]}
                    {" · "}
                    format {selectedFormat?.size ?? "—"}
                    {" · "}
                    {formatWeight(weight)}
                    {fragile ? " · fragile" : null}
                  </RecapValue>
                </RecapSection>
                <RecapSection title="Annonce" onEdit={() => goTo(2)}>
                  <div className="space-y-2">
                    <RecapValue>
                      {title.trim() || "Titre généré à la publication"}
                    </RecapValue>
                    {description.trim() ? (
                      <RecapValue className="py-3 leading-6 font-normal">
                        {description.trim()}
                      </RecapValue>
                    ) : null}
                  </div>
                </RecapSection>
                <p className="m-0 mb-5 rounded-lg bg-[#F6F6F6] px-4 py-3 text-[13px] leading-5 text-[#545454]">
                  Ces informations ne sont pas visibles publiquement. Seul le
                  conducteur retenu pour la livraison y aura accès.
                </p>
                <RecapSection title="Remise du colis" onEdit={() => goTo(3)}>
                  <div className="space-y-2">
                    <RecapValue>
                      {destAddress.trim() || shortPlace(destination?.name)}
                    </RecapValue>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <RecapValue
                        className={
                          recipientFirstName.trim()
                            ? undefined
                            : "font-normal text-[#6B6B6B]"
                        }
                      >
                        {recipientFirstName.trim() || "Prénom non renseigné"}
                      </RecapValue>
                      <RecapValue
                        className={
                          recipientLastName.trim()
                            ? undefined
                            : "font-normal text-[#6B6B6B]"
                        }
                      >
                        {recipientLastName.trim() || "Nom non renseigné"}
                      </RecapValue>
                    </div>
                    <RecapValue
                      className={
                        recipientPhone.trim()
                          ? undefined
                          : "font-normal text-[#6B6B6B]"
                      }
                    >
                      {recipientPhone.trim() || "Téléphone non renseigné"}
                    </RecapValue>
                    {meetingPoint.trim() ? (
                      <RecapValue>{meetingPoint.trim()}</RecapValue>
                    ) : null}
                  </div>
                </RecapSection>
              </div>
            ) : null}
          </div>

          {stepError ? (
            <p className="uber-error mt-5" role="alert">
              {stepError}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setStepError("");
                  setStep(step - 1);
                }}
                className="btn-brand-secondary h-12 px-5"
              >
                Retour
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-brand h-12 px-6 disabled:opacity-50"
            >
              {step < STEPS.length - 1 ? "Continuer" : submitLabel}
            </button>
          </div>
        </form>
      </UberCard>

      <aside className="lg:sticky lg:top-24">
        <p className="uber-home-kicker mb-3">Aperçu de l&apos;annonce</p>
        <ParcelCard
          listing={previewListing}
          preview
          coverSrc={photoPreview}
        />
      </aside>
    </div>
  );
}
