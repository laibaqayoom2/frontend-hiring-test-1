import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // disable image optimization for Netlify / client-side rendering
  },
};

export default nextConfig;
