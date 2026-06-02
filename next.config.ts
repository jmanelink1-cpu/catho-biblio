import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats + responsive optimization for remote imagery.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;
