import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ServiceListingPage } from '@green-world/views/ServiceListing';
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
    pathname: '/services',
    title: `Zeleni svet | ${messages.navbar.services}`,
    description: messages.metaTags.defaultDescription,
    keywords: messages.metaTags.defaultKeywords
  });
}

export default function ServicesPage() {
  return (
    <Suspense>
      <ServiceListingPage />
    </Suspense>
  );
}
