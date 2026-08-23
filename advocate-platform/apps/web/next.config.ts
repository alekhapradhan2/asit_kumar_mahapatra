import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ─── Images ──────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─── Redirects ────────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: '/portal',
        destination: '/client/login',
        permanent: true,
      },
    ];
  },

  // ─── Headers ─────────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Prevent all client/admin routes from being cached by CDNs
        source: '/(client|admin)/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ];
  },

  // ─── Experimental ────────────────────────────────────────────────────────────
  experimental: {
    optimizeCss: true,
  },

  // ─── Build ───────────────────────────────────────────────────────────────────
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
