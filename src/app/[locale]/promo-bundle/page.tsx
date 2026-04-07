import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { PromoBundle } from '@green-world/views/PromoBundle';
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
    pathname: '/promo-bundle',
    title: messages.seo.promoBundle.title,
    description: messages.seo.promoBundle.description,
    keywords: messages.seo.promoBundle.keywords,
    noIndex: true
  });
}

export default function PromoBundlePage() {
  return <PromoBundle />;
}
