import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6e6tchapm8.ufs.sh"
      }
    ]
  }
};

export default nextConfig;
