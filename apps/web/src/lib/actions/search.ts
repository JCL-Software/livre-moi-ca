"use server";

import { createClient } from "@/lib/supabase/server";
import { searchTrips as searchTripsQuery } from "@livre-moi/shared/data";
import type { ActionResult, SearchTripResult, SearchTripsInput } from "@livre-moi/shared";

export async function searchTrips(
  input: SearchTripsInput,
): Promise<ActionResult<SearchTripResult[]>> {
  const supabase = await createClient();
  return searchTripsQuery(supabase, input);
}
