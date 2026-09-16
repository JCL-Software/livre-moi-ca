"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, KIND, SIZE } from "baseui/button";
import { Input } from "baseui/input";
import { UberCard, UberIconTile } from "@/components/baseweb/uber-ui";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { ParcelSize } from "@/lib/types";

export function ParcelMarketplaceFilters({
  origin = "",
  dest = "",
  size = "",
}: {
  origin?: string;
  dest?: string;
  size?: string;
}) {
  const router = useRouter();
  const [originValue, setOriginValue] = useState(origin);
  const [destValue, setDestValue] = useState(dest);
  const [sizeValue, setSizeValue] = useState(size);

  function apply(nextSize = sizeValue) {
    const params = new URLSearchParams();
    if (originValue.trim()) params.set("origin", originValue.trim());
    if (destValue.trim()) params.set("dest", destValue.trim());
    if (nextSize) params.set("size", nextSize);
    const query = params.toString();
    router.push(query ? `/colis?${query}` : "/colis");
  }

  function toggleSize(next: ParcelSize) {
    const selected = sizeValue === next ? "" : next;
    setSizeValue(selected);
    apply(selected);
  }

  return (
    <UberCard>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          apply();
        }}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input
            value={originValue}
            onChange={(event) => setOriginValue(event.currentTarget.value)}
            placeholder="Ville de départ"
            clearable
          />
          <Input
            value={destValue}
            onChange={(event) => setDestValue(event.currentTarget.value)}
            placeholder="Ville d'arrivée"
            clearable
          />
          <Button type="submit" kind={KIND.primary} size={SIZE.large}>
            Filtrer
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#545454]">Format</span>
          {PARCEL_FORMATS.map((format) => {
            const Icon = format.icon;
            const selected = sizeValue === format.value;
            return (
              <button
                key={format.value}
                type="button"
                aria-label={`Format ${format.size}`}
                aria-pressed={selected}
                onClick={() => toggleSize(format.value)}
                className="p-0"
              >
                <UberIconTile>
                  <span className={selected ? "text-black" : "text-[#545454]"}>
                    <Icon size={20} />
                  </span>
                </UberIconTile>
              </button>
            );
          })}
          {origin || dest || size ? (
            <Button
              type="button"
              kind={KIND.tertiary}
              size={SIZE.compact}
              onClick={() => {
                setOriginValue("");
                setDestValue("");
                setSizeValue("");
                router.push("/colis");
              }}
            >
              Réinitialiser
            </Button>
          ) : null}
        </div>
      </form>
    </UberCard>
  );
}
