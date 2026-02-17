/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Añade esta configuración para mejorar la detección de cambios en Docker
  webpack: (config: any) => {
    // Habilita el polling para que Webpack detecte cambios de archivos
    // de manera fiable dentro de un contenedor Docker.
    config.watchOptions = {
      poll: 500, // Comprueba cambios cada medio segundo
      aggregateTimeout: 300, // Espera 300ms después de un cambio antes de reconstruir
    };
    return config;
  },
};

export default nextConfig;

