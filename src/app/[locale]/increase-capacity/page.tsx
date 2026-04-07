import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { IncreaseCapacity } from '@green-world/views/IncreaseCapacity';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createLocalizedPageMetadata({
    locale: appLocale,
    pathname: '/increase-capacity',
    title: messages.seo.increaseCapacity.title,
    description: messages.seo.increaseCapacity.description,
    keywords: messages.seo.increaseCapacity.keywords,
    noIndex: true
  });
}

export default function IncreaseCapacityPage() {
  return <IncreaseCapacity />;
}
