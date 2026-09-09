"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  cancelTripRecord,
  DEMO_TRIP_SAMPLES,
  publishTripRecord,
} from "@livre-moi/shared/data";
import type { ActionResult, PublishTripInput } from "@livre-moi/shared";

export type { PublishTripInput };

export async function publishTrip(
  input: PublishTripInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Connectez-vous pour publier un trajet." };

  const result = await publishTripRecord(supabase, user.id, input);
  if (result.ok) {
    revalidatePath("/");
    revalidatePath("/tableau-de-bord");
  }
  return result;
}

export async function cancelTrip(tripId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié." };

  const result = await cancelTripRecord(supabase, user.id, tripId);
  if (result.ok) revalidatePath("/tableau-de-bord");
  return result;
}

export async function seedDemoTrips(): Promise<ActionResult<{ count: number }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Connectez-vous pour générer les trajets démo." };

  const now = new Date();
  let count = 0;
  for (const [index, sample] of DEMO_TRIP_SAMPLES.entries()) {
    const result = await publishTrip({
      ...sample,
      departureTime: new Date(
        now.getTime() + (index + 1) * 24 * 3600_000,
      ).toISOString(),
    });
    if (result.ok) count += 1;
  }

  return { ok: true, data: { count } };
}
