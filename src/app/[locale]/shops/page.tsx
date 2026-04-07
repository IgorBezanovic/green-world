import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Shops } from '@green-world/views/Shops';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createPageMetadata({
    locale: appLocale,
    pathname: '/shops',
    title: messages.seo.shops.title,
    description: messages.seo.shops.description,
    keywords: messages.seo.shops.keywords
  });
}

export default function ShopsPage() {
  return (
    <Suspense>
      <Shops />
    </Suspense>
  );
}
