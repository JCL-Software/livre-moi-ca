import type { MetadataRoute } from "next";
import { APP_NAME, APP_TAGLINE, BRAND_BLACK, BRAND_ORANGE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: "Livre-moi",
    description: APP_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_BLACK,
    theme_color: BRAND_ORANGE,
    lang: "fr-CA",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
