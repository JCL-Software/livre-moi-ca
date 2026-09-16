import { revalidatePath } from "next/cache";

export function revalidateAccount(extra: string[] = []) {
  revalidatePath("/compte", "layout");
  revalidatePath("/tableau-de-bord");
  revalidatePath("/profil");
  revalidatePath("/notifications");
  for (const path of extra) {
    revalidatePath(path);
  }
}
