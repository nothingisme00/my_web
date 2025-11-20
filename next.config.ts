import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  poweredByHeader: false, // Security: Hide X-Powered-By header
  compress: true, // Enable gzip compression
};

export default nextConfig;
