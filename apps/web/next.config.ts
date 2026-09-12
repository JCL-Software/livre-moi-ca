import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@livre-moi/shared"],
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
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
