import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: "export" }),
  reactStrictMode: true,
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/auth/:path*",
              destination: "https://haq-api.abohashish.tech/auth/:path*",
            },
            {
              source: "/api/v1/:path*",
              destination: "https://haq-api.abohashish.tech/api/v1/:path*",
            },
            {
              source: "/uploads/:path*",
              destination: "https://haq-api.abohashish.tech/uploads/:path*",
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
