import createNextIntlPlugin from 'next-intl/plugin';

import withPWAInit from './pwa-wrapper.mjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /\/api\/.*$/i,
      handler: 'NetworkOnly',
      method: 'GET'
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 60 * 60 * 24 * 365
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'remote-images',
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24 * 30
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\/_next\/image\?url=.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-image-optimizer',
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24 * 30
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-assets',
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 60 * 60 * 24 * 365
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.mode === 'navigate',
      handler: 'NetworkFirst',
      method: 'GET',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 3
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }
  ],
  fallbacks: {
    document: '/offline.html',
    image: '/offline.html',
    audio: '/offline.html',
    video: '/offline.html',
    font: '/offline.html'
  }
});

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  async redirects() {
    return [
      {
        source: '/search',
        destination: '/products',
        permanent: true
      },
      {
        source: '/search/:category',
        destination: '/products/:category',
        permanent: true
      }
    ];
  },
  async rewrites() {
    return {
      // Fallback for Turbopack dev: the next-intl middleware correctly rewrites
      // /path → /sr/path internally (URL stays /path) in production.
      // In Turbopack dev this middleware rewrite is skipped for default-locale
      // paths, so these beforeFiles rewrites handle direct URL access as a safety net.
      // In production the middleware handles routing first, so these rules are
      // never reached for requests that middleware already processed.
      beforeFiles: [
        {
          source:
            '/:path((?!sr(?:/|$)|en(?:/|$)|ru(?:/|$)|_next|api|feed|_vercel|[^/]+\\.[^/]+).+)',
          destination: '/sr/:path'
        }
      ]
    };
  }
};

export default withPWA(withNextIntl(nextConfig));
