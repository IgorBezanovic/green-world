import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Products } from '@green-world/views/Products';
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
    pathname: '/products',
    title: messages.productsView.metaTitle,
    description: messages.metaTags.defaultDescription,
    keywords: messages.metaTags.defaultKeywords
  });
}

export default function SearchPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
