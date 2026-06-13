import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.6"],
  images: {
    /**
     * Allow Next.js Image component to load images from DummyJSON CDN.
     * Both the main domain and the CDN subdomain are included.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/**",
      },
      // Some DummyJSON products use i.dummyjson.com
      {
        protocol: "https",
        hostname: "i.dummyjson.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
