import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { PromoteShop } from '@green-world/views/PromoteShop';
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
    pathname: '/promote-shop',
    title: messages.seo.promoteShop.title,
    description: messages.seo.promoteShop.description,
    keywords: messages.seo.promoteShop.keywords,
    noIndex: true
  });
}

export default function PromoteShopPage() {
  return <PromoteShop />;
}
