function readProcessEnv(): Record<string, string | undefined> {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  return env ?? {};
}

function firstEnv(keys: string[]): string | undefined {
  const env = readProcessEnv();
  for (const key of keys) {
    const value = env[key];
    if (value) return value;
  }
  return undefined;
}

export function getSupabaseUrl(): string {
  return (
    firstEnv([
      "EXPO_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_URL",
    ]) ?? ""
  );
}

export function getSupabaseAnonKey(): string {
  return (
    firstEnv([
      "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_ANON_KEY",
    ]) ?? ""
  );
}

export function getSiteUrl(): string {
  return firstEnv(["EXPO_PUBLIC_SITE_URL", "NEXT_PUBLIC_SITE_URL"]) ?? "";
}

export function getOrsApiKey(): string | undefined {
  return firstEnv(["ORS_API_KEY", "EXPO_PUBLIC_ORS_API_KEY"]);
}
