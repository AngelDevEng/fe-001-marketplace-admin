import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.LARAVEL_API_URL}/:path*`,
      },
    ];
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  turbopack: {},
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'lyriumbiomarketplace.com' },
      { protocol: 'https', hostname: '**.woocommerce.com' },
      { protocol: 'https', hostname: '**.wp.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: '*.lyrium.com' },
      { protocol: 'https', hostname: 'lyrium.com' },
      { protocol: 'https', hostname: 'lyriumbiomarketplace.com' },
      { protocol: 'https', hostname: '**.lyriumbiomarketplace.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
