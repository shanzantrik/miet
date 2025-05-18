/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  webpack: (config, { dev, isServer }) => {
    // Configure Terser
    if (!dev) {
      config.optimization.minimizer = config.optimization.minimizer.map(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions = {
            ...minimizer.options.terserOptions,
            output: {
              ...minimizer.options.terserOptions?.output,
              ascii_only: true, // Force ASCII output
            },
            compress: {
              ...minimizer.options.terserOptions?.compress,
              drop_console: true, // Remove console.logs in production
            },
          };
        }
        return minimizer;
      });
    }
    return config;
  },
  // Disable the warning about .next directory
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
