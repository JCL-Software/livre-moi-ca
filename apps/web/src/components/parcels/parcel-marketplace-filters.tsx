"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PARCEL_FORMATS } from "@/lib/parcel-formats";
import type { ParcelSize } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    <form
      className="space-y-4 rounded-xl border border-[#E8E8E8] bg-white p-4 transition duration-200 dark:border-white/10 dark:bg-neutral-950"
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Input
          name="origin"
          value={originValue}
          onChange={(event) => setOriginValue(event.target.value)}
          placeholder="Ville de départ"
          className="h-11 rounded-xl border-neutral-200 bg-[#F6F6F6] px-3 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
          aria-label="Ville de départ"
        />
        <Input
          name="dest"
          value={destValue}
          onChange={(event) => setDestValue(event.target.value)}
          placeholder="Ville d'arrivée"
          className="h-11 rounded-xl border-neutral-200 bg-[#F6F6F6] px-3 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
          aria-label="Ville d'arrivée"
        />
        <Button type="submit" className="h-11 rounded-xl px-5">
          Filtrer
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600 dark:text-slate-400">Format</span>
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
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                selected
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-[#F6F6F6] text-black hover:bg-[#EDEDED] dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
        {origin || dest || size ? (
          <button
            type="button"
            onClick={() => {
              setOriginValue("");
              setDestValue("");
              setSizeValue("");
              router.push("/colis");
            }}
            className="text-sm text-neutral-500 underline-offset-4 hover:underline dark:text-neutral-400"
          >
            Réinitialiser
          </button>
        ) : null}
      </div>
    </form>
  );
}
