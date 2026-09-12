import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@livre-moi/shared"],
  turbopack: {
    resolveAlias: {
      "maplibre-gl": "maplibre-gl/dist/maplibre-gl.js",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
