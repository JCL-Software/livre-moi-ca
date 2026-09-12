import path from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = path.resolve(packageDir, "../../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@livre-moi/shared"],
  images: { unoptimized: true },
  // `next` est hissé à la racine du monorepo : Turbopack doit la voir.
  outputFileTracingRoot: monorepoRoot,
  turbopack: {
    root: monorepoRoot,
  },
};

export default nextConfig;
