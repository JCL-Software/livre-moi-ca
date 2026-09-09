import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@livre-moi/shared"],
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
