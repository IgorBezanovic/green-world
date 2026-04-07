import { UserStatistics } from '@green-world/components/UserStatistics';
import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
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
    pathname: '/profile-settings/statistics',
    title: messages.profileSettingsView.buttons.statistics,
    noIndex: true
  });
}

export default function ProfileStatisticsPage() {
  return <UserStatistics />;
}
