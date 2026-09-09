import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createBrowserSupabaseClient,
  type LivreMoiClient,
} from "@livre-moi/shared/supabase";

let client: LivreMoiClient | null = null;

export function getMobileSupabase(): LivreMoiClient {
  if (!client) {
    client = createBrowserSupabaseClient({
      authStorage: AsyncStorage,
    });
  }
  return client;
}
