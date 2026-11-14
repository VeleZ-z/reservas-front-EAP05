/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Modo export estático - genera archivos HTML y CSS puros
  output: "export",
  // Sin base path para Vercel
  trailingSlash: true,
  // Configuración webpack simple si es necesario
  webpack: (config, { dev, isServer }) => {
    return config;
  },
};

module.exports = nextConfig;