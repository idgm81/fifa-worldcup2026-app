import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io', // Dominio de la API de Football
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.fifa.com', // Dominio de la API de FIFA
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;