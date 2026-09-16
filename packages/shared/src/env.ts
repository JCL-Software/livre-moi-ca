function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value) return value;
  }
  return undefined;
}

function usableMapboxToken(value: string | undefined): string | undefined {
  const token = value?.trim();
  if (!token || token.length < 20) return undefined;
  if (
    !token.startsWith("pk.") &&
    !token.startsWith("sk.") &&
    !token.startsWith("tk.")
  ) {
    return undefined;
  }
  return token;
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

export function getMapboxSecretToken(): string {
  return (
    usableMapboxToken(
      firstDefined(
        process.env.MAPBOX_SECRET_TOKEN,
        process.env.MAPBOX_ACCESS_TOKEN,
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
      ),
    ) ?? ""
  );
}

export function getMapboxPublicToken(): string {
  return (
    usableMapboxToken(
      firstDefined(
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
        process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
        process.env.MAPBOX_ACCESS_TOKEN,
      ),
    ) ?? ""
  );
}
