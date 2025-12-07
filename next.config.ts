import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */

  // Skip database-dependent pages during build
  // These will be rendered on-demand
  output: undefined,

  // Increase body size limit for video uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.gstatic.com",
      },
      // Only allow localhost in development
      ...(isDev
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
            },
            {
              protocol: "https" as const,
              hostname: "localhost",
            },
          ]
        : []),
    ],
  },
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression

  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // Fix photo paths - bypass locale routing for /uploads
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:locale/uploads/:path*",
          destination: "/uploads/:path*",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
