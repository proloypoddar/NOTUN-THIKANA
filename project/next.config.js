/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Set the server port to 3010
  serverRuntimeConfig: {
    port: 3010,
  },
  // Set the public runtime config
  publicRuntimeConfig: {
    port: 3010,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Configure images for Vercel deployment
  images: {
    domains: ['randomuser.me', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Ensure proper handling of rewrites and redirects
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // Add custom headers for security and caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
