import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Events } from '@green-world/views/Events';
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
    pathname: '/events',
    title: messages.seo.events.title,
    description: messages.seo.events.description,
    keywords: messages.seo.events.keywords
  });
}

export default function EventsPage() {
  return (
    <Suspense>
      <Events />
    </Suspense>
  );
}
