import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ProfileOrders } from '@green-world/views/ProfileOrders';
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
    pathname: '/profile/orders',
    title: messages.profileOrdersView.mainTitle,
    noIndex: true
  });
}

export default function ProfileOrdersPage() {
  return <ProfileOrders />;
}
