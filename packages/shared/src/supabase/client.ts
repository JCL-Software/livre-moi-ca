import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "../env";

export type LivreMoiClient = SupabaseClient;

export type AuthStorage = {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
};

export function createBrowserSupabaseClient(options?: {
  authStorage?: AuthStorage;
}): LivreMoiClient {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error(
      "Variables Supabase manquantes (URL + clé publishable/anon).",
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: typeof globalThis.window !== "undefined",
      storage: options?.authStorage,
    },
  });
}
