"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  listOpenParcelListings,
  publishParcelRecord,
  updateParcelRecord,
} from "@livre-moi/shared/data";
import { publishParcelSchema } from "@livre-moi/shared/validations";
import type {
  ActionResult,
  ListOpenParcelsFilters,
  ParcelListing,
  PublishParcelInput,
} from "@livre-moi/shared";

export async function publishParcel(
  input: PublishParcelInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = publishParcelSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Vérifiez les informations du colis." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Connectez-vous pour publier un colis." };
  }

  const result = await publishParcelRecord(supabase, user.id, parsed.data);
  if (result.ok) {
    revalidatePath("/colis");
    revalidatePath("/tableau-de-bord");
    revalidatePath(`/colis/${result.data.id}`);
  }
  return result;
}

export async function updateParcel(
  listingId: string,
  input: PublishParcelInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = publishParcelSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Vérifiez les informations du colis." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Connectez-vous pour modifier un colis." };
  }

  const result = await updateParcelRecord(supabase, user.id, listingId, parsed.data);
  if (result.ok) {
    revalidatePath("/colis");
    revalidatePath("/tableau-de-bord");
    revalidatePath(`/colis/${listingId}`);
  }
  return result;
}

export async function listParcels(
  filters: ListOpenParcelsFilters = {},
): Promise<ActionResult<ParcelListing[]>> {
  const supabase = await createClient();
  return listOpenParcelListings(supabase, filters);
}
