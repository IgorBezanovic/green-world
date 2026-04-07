import { GoogleAnalytics } from '@green-world/components/GoogleAnalytics';
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
    pathname: '/admin/google-analytics',
    title: messages.googleAnalytics.overviewLast30Days,
    description: messages.seo.adminPanel.description,
    keywords: messages.seo.adminPanel.keywords,
    noIndex: true
  });
}

export default function AdminGoogleAnalyticsPage() {
  return <GoogleAnalytics />;
}
