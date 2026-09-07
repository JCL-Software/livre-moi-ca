import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: { unoptimized: true },
  // Évite que Next remonte à la racine livre-moi-ca (autre lockfile / proxy.ts)
  outputFileTracingRoot: packageDir,
  turbopack: {
    root: packageDir,
  },
};

export default nextConfig;
