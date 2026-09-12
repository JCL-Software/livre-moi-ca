import type { Metadata } from "next";
import { Suspense } from "react";
import { PublishParcelForm } from "@/components/parcels/publish-parcel-form";
import { createClient } from "@/lib/supabase/server";
import { APP_NAME } from "@/lib/constants";
import type { ParcelSize } from "@/lib/types";

export const metadata: Metadata = {
  title: "Publier un colis",
  description: `Publiez votre colis sur ${APP_NAME}. Les conducteurs voient votre annonce et vous proposent un trajet.`,
};

type SearchParams = {
  origin?: string;
  dest?: string;
  olat?: string;
  olng?: string;
  dlat?: string;
  dlng?: string;
  date?: string;
  size?: string;
  fragile?: string;
  weight?: string;
  price?: string;
  distance?: string;
};

const SIZES = new Set<ParcelSize>([
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
]);

function parseNumber(value?: string) {
  if (!value) return undefined;
  const next = Number(value);
  return Number.isFinite(next) ? next : undefined;
}

export default async function NewParcelPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  let loggedIn = false;
  if (configured) {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();
    loggedIn = Boolean(session.data.user);
  }

  const originLat = parseNumber(params.olat);
  const originLng = parseNumber(params.olng);
  const destLat = parseNumber(params.dlat);
  const destLng = parseNumber(params.dlng);
  const weight = parseNumber(params.weight);
  const price = parseNumber(params.price);
  const distance = parseNumber(params.distance);
  const size = params.size && SIZES.has(params.size as ParcelSize)
    ? (params.size as ParcelSize)
    : null;

  return (
    <section className="section-muted">
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-10 lg:py-12">
        <div className="space-y-7 rounded-3xl border border-[#E8E8E8] bg-white p-8 shadow-xl shadow-black/5 dark:border-white/10 dark:bg-neutral-900 dark:shadow-black/40">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black md:text-3xl dark:text-white">
              Publier un colis
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              Votre annonce est visible des conducteurs sur le même trajet. Les
              champs de l&apos;estimateur sont déjà remplis.
            </p>
          </div>
          <Suspense>
            <PublishParcelForm
              loggedIn={loggedIn}
              defaults={{
                origin:
                  params.origin && originLat != null && originLng != null
                    ? { name: params.origin, lat: originLat, lng: originLng }
                    : null,
                destination:
                  params.dest && destLat != null && destLng != null
                    ? { name: params.dest, lat: destLat, lng: destLng }
                    : null,
                size,
                weight: weight ?? 1,
                fragile: params.fragile === "1",
                date: params.date ?? new Date().toISOString().slice(0, 10),
                price,
                distance,
              }}
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
