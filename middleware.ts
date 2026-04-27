import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

import { LOCALE_COOKIE_NAME, routing } from './src/i18n/routing';

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

const normalizeLocale = (locale?: string | null) => {
  if (routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return locale as (typeof routing.locales)[number];
  }

  return null;
};

const getLocaleAndPath = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  const locale = normalizeLocale(first);

  if (locale) {
    const path = `/${segments.slice(1).join('/')}` || '/';
    return { locale, path, hasLocalePrefix: true };
  }

  return {
    locale: routing.defaultLocale,
    path: pathname || '/',
    hasLocalePrefix: false
  };
};

const getLocalizedPathname = (pathname: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return pathname;
  }

  if (pathname === '/') {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
};

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const {
    locale: pathLocale,
    path,
    hasLocalePrefix
  } = getLocaleAndPath(pathname);
  const cookieLocale = normalizeLocale(
    request.cookies.get(LOCALE_COOKIE_NAME)?.value
  );
  const locale = hasLocalePrefix
    ? pathLocale
    : (cookieLocale ?? routing.defaultLocale);

  if (isProtectedPath(path)) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      const loginPath =
        locale === routing.defaultLocale ? '/login' : `/${locale}/login`;
      const url = new URL(loginPath, request.url);
      return NextResponse.redirect(url);
    }
  }

  if (!hasLocalePrefix && locale !== routing.defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedPathname(pathname, locale);
    url.search = search;

    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: '/',
      sameSite: 'lax'
    });

    return response;
  }

  const response = intlMiddleware(request);
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    sameSite: 'lax'
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|feed|_next|_vercel|.*\\..*).*)']
};
