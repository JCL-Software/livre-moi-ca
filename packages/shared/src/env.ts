function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value) return value;
  }
  return undefined;
}

export function getSupabaseUrl(): string {
  // Accès littéral requis : Next.js / Expo n'inlinent pas process.env[key].
  return (
    firstDefined(
      process.env.EXPO_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_URL,
    ) ?? ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    firstDefined(
      process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      process.env.SUPABASE_ANON_KEY,
    ) ?? ""
  );
}

export function getSiteUrl(): string {
  return (
    firstDefined(
      process.env.EXPO_PUBLIC_SITE_URL,
      process.env.NEXT_PUBLIC_SITE_URL,
    ) ?? ""
  );
}

export function getOrsApiKey(): string | undefined {
  return firstDefined(process.env.ORS_API_KEY, process.env.EXPO_PUBLIC_ORS_API_KEY);
}
