import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '258c828e8cc853bf5e0efd001055fb39.ipfscdn.io',
      },
    ],
  },
};

export default nextConfig;
