import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { PromoteProduct } from '@green-world/views/PromoteProduct';
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
    pathname: '/promote-product',
    title: messages.seo.promoteProduct.title,
    description: messages.seo.promoteProduct.description,
    keywords: messages.seo.promoteProduct.keywords,
    noIndex: true
  });
}

export default function PromoteProductPage() {
  return <PromoteProduct />;
}
