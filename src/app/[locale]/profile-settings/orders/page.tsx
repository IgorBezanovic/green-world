import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { OrdersView } from '@green-world/views/Orders/OrdersView';
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
    pathname: '/profile-settings/orders',
    title: messages.profileSettingsView.buttons.orders,
    noIndex: true
  });
}

export default function ProfileOrdersPage() {
  return <OrdersView variant="profile" />;
}
