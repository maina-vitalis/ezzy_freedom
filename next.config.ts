import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
        hostname: "lh3.googleusercontent.com",
        pathname: "**/*",
      },
    ],
  },
};

export default nextConfig;
