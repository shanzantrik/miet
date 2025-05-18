/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  output: 'standalone', // Optimize for Vercel deployment
  poweredByHeader: false, // Remove X-Powered-By header
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: config.optimization.minimizer.map(minimizer => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options.terserOptions = {
              ...minimizer.options.terserOptions,
              output: {
                ...minimizer.options.terserOptions?.output,
                ascii_only: true,
                comments: false,
              },
              compress: {
                ...minimizer.options.terserOptions?.compress,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
              },
            };
          }
          return minimizer;
        }),
      };
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
  // Optimize image loading
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Add path aliases
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
