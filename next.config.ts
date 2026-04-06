import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
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
            '/:path((?!sr(?:/|$)|en(?:/|$)|ru(?:/|$)|_next|api|_vercel|[^/]+\\.[^/]+).+)',
          destination: '/sr/:path'
        }
      ]
    };
  }
};

export default withNextIntl(nextConfig);
