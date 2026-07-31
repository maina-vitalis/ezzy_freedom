import type { NextConfig } from "next";

const r2PublicHost = process.env.R2_PUBLIC_HOSTNAME;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "35jq5szehk.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "cdn.ezzyfreedomandhope.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      ...(r2PublicHost
        ? [
            {
              protocol: "https" as const,
              hostname: r2PublicHost,
              pathname: "/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**/*",
      },
    ],
  },
};

export default nextConfig;
