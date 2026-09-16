"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, KIND, SIZE } from "baseui/button";
import { UberCalendarField } from "@/components/baseweb/uber-calendar";
import { UberWhenToggle, type WhenMode } from "@/components/baseweb/uber-when-toggle";
import { AddressAutocomplete } from "@/components/search/address-autocomplete";
import EstimateMap from "@/components/maps/estimate-map";
import { getParcelRouteDistance } from "@/lib/actions/pricing";
import type { BookingType, GeoPoint } from "@/lib/types";

export type UberHomeMode = "parcel" | "passenger" | "drive";
export type UberHomeDriveIntent = "parcel" | "seats";

function nowLocalDateTime() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function homeCopy(mode: UberHomeMode, intent: UberHomeDriveIntent) {
  if (mode === "parcel") {
    return {
      kicker: "Livraison collaborative",
      title: "Votre colis voyage où vous le souhaitez avec Livre-moi.ca",
      lead: "Faites livrer vos colis entre les villes du Québec et de l’Ontario grâce à des conducteurs qui prennent déjà la route. Une solution simple, humaine et pratique pour envoyer ce qui compte, sans détour inutile.",
      submit: "Publier mon colis",
      secondaryLabel: "Voir les trajets déjà prévus",
    };
  }
  if (mode === "passenger") {
    return {
      kicker: "Covoiturage régional au Québec et en Ontario",
      title: "Votre trajet est déjà prévu. Partagez-le simplement.",
      lead: "Trouvez une place dans un véhicule qui se dirige déjà vers votre destination, ou proposez les places libres de votre trajet. Livre-moi.ca met en relation passagers et conducteurs vérifiés.",
      submit: "Voir les trajets",
      secondaryLabel: "Publier un trajet",
    };
  }
  if (intent === "seats") {
    return {
      kicker: "Covoiturage régional au Québec et en Ontario",
      title: "Vous roulez déjà ? Partagez vos places libres et réduisez vos frais.",
      lead: "Proposez les sièges vides de votre véhicule sur un trajet déjà prévu, entre les villes du Québec et de l’Ontario.",
      submit: "Publier mon trajet",
      secondaryLabel: null,
    };
  }
  return {
    kicker: "Vous prenez déjà la route",
    title: "Vous faites déjà le trajet ? Rentabilisez l’espace dans votre véhicule.",
    lead: "Au Québec et en Ontario, les annonces de colis sont publiques. Publiez votre trajet, ou parcourez les colis et proposez un tarif — l’expéditeur choisit.",
    submit: "Publier mon trajet",
    secondaryLabel: "Voir les colis disponibles",
  };
}

export function UberHome({
  mode,
  intent = "parcel",
}: {
  mode: UberHomeMode;
  intent?: UberHomeDriveIntent;
}) {
  const router = useRouter();
  const copy = homeCopy(mode, intent);
  const [origin, setOrigin] = useState<GeoPoint | null>(null);
  const [destination, setDestination] = useState<GeoPoint | null>(null);
  const [date, setDate] = useState("");
  const [whenMode, setWhenMode] = useState<WhenMode>("now");
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<[number, number][] | undefined>();
  const type: BookingType = mode === "parcel" ? "PARCEL" : "PASSENGER";

  useEffect(() => {
    setDate(nowLocalDateTime());
  }, []);

  useEffect(() => {
    if (!origin || !destination) {
      setRoute(undefined);
      return;
    }
    let cancelled = false;
    getParcelRouteDistance({
      originLat: origin.lat,
      originLng: origin.lng,
      destLat: destination.lat,
      destLng: destination.lng,
    }).then((result) => {
      if (cancelled) return;
      setRoute(result.ok ? result.data.shortest.coordinates : undefined);
    });
    return () => {
      cancelled = true;
    };
  }, [origin, destination]);

  function geoParams() {
    if (!origin || !destination) return null;
    const when = whenMode === "now" ? nowLocalDateTime() : date;
    const params = new URLSearchParams({
      origin: origin.name,
      olat: String(origin.lat),
      olng: String(origin.lng),
      dest: destination.name,
      dlat: String(destination.lat),
      dlng: String(destination.lng),
      date: when.slice(0, 10),
    });
    if (when.length >= 16) params.set("time", when.slice(11, 16));
    return params;
  }

  function submit() {
    const params = geoParams();
    if (!params) {
      setError("Choisissez une origine et une destination dans la liste.");
      return;
    }
    if (mode === "parcel") {
      router.push(`/calculateur?${params.toString()}`);
      return;
    }
    if (mode === "drive") {
      router.push(`/trajets/nouveau?${params.toString()}`);
      return;
    }
    params.set("type", type);
    router.push(`/recherche?${params.toString()}`);
  }

  const secondaryHref = (() => {
    if (mode === "parcel") {
      const params = geoParams() ?? new URLSearchParams();
      params.set("type", type);
      return `/recherche?${params.toString()}`;
    }
    if (mode === "passenger") {
      const params = geoParams();
      return params ? `/trajets/nouveau?${params.toString()}` : "/trajets/nouveau";
    }
    if (intent === "parcel") return "/colis";
    return null;
  })();

  return (
    <div className="uber-home">
      <section className="uber-home-hero">
        <div className="uber-home-copy">
          <p className="uber-home-kicker">{copy.kicker}</p>
          <h1 className="uber-home-title">{copy.title}</h1>
          <p className="uber-home-lead">{copy.lead}</p>

          <div className="uber-search-card">
            <UberWhenToggle
              value={whenMode}
              onChange={(next) => {
                setWhenMode(next);
                if (next === "now") setDate(nowLocalDateTime());
              }}
            />
            <div className="uber-search-places">
              <AddressAutocomplete
                id="uber-origin"
                placeholder="Lieu de prise en charge"
                value={origin}
                onChange={(value) => {
                  setOrigin(value);
                  setError(null);
                }}
                variant="uber"
                locate
              />
              <AddressAutocomplete
                id="uber-dest"
                placeholder="Destination"
                value={destination}
                onChange={(value) => {
                  setDestination(value);
                  setError(null);
                }}
                variant="uber"
              />
            </div>
            {whenMode === "later" ? (
              <UberCalendarField
                id="uber-date"
                value={date}
                onChange={setDate}
                minDate={new Date()}
                withTime
                triggerClassName="uber-date"
                aria-label="Date et heure"
              />
            ) : null}
            {error ? <p className="uber-error">{error}</p> : null}
            <Button kind={KIND.primary} size={SIZE.large} onClick={submit}>
              {copy.submit}
            </Button>
            {copy.secondaryLabel && secondaryHref ? (
              <Link href={secondaryHref} className="uber-search-secondary">
                {copy.secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="uber-home-map">
          <EstimateMap
            origin={origin}
            destination={destination}
            activeRoute={route}
            deferUntilPins
          />
        </div>
      </section>
    </div>
  );
}
