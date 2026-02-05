/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour Docker et déploiement
  output: 'standalone',
  
  // Désactiver strict mode en production pour éviter les rendus doubles
  reactStrictMode: false,
  
  // Configuration des images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Configuration pour le déploiement
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
  
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Rewrites pour l'API
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;