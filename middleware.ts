import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedPrefixes = [
  '/write-post',
  '/profile',
  '/profile-settings',
  '/create-product',
  '/edit-product',
  '/order-product',
  '/create-event',
  '/edit-event',
  '/promote-product',
  '/promote-shop',
  '/increase-capacity',
  '/promo-bundle',
  '/admin',
  '/services/create'
];

const isProtectedPath = (pathname: string) => {
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return /^\/services\/[^/]+\/edit\/?$/.test(pathname);
};

const getLocaleAndPath = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (routing.locales.includes(first as (typeof routing.locales)[number])) {
    const locale = first;
    const path = `/${segments.slice(1).join('/')}` || '/';
    return { locale, path };
  }

  return { locale: routing.defaultLocale, path: pathname || '/' };
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, path } = getLocaleAndPath(pathname);

  if (isProtectedPath(path)) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginPath =
        locale === routing.defaultLocale ? '/login' : `/${locale}/login`;
      const url = new URL(loginPath, request.url);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
