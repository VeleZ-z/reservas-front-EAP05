/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Modo estándar para Vercel (sin output: "export")
  // Esto permite que Tailwind y React funcionen plenamente
  trailingSlash: true,
  // Configuración webpack simple si es necesario
  webpack: (config, { dev, isServer }) => {
    return config;
  },
  // Optimizaciones para producción
  compiler: {
    react18: true,
  },
};

module.exports = nextConfig;