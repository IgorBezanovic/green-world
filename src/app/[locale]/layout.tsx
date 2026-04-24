import { Layout } from '@green-world/components/Layout/Layout';
import { routing } from '@green-world/i18n/routing';
import {
  createLocaleFallbackMetadata,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import { Providers } from '../providers';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createLocaleFallbackMetadata(normalizeLocale(locale));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const initialToken = (await cookies()).get('token')?.value ?? null;

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers initialToken={initialToken}>
        <Layout>{children}</Layout>
      </Providers>
    </NextIntlClientProvider>
  );
}
