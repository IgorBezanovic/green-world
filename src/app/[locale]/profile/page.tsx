import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { UserProfile } from '@green-world/views/UserProfile';
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
    pathname: '/profile',
    title: messages.breadcrumbs.userProfile,
    description: messages.seo.userProfile.fallbackDescription,
    noIndex: true
  });
}

export default function ProfilePage() {
  return <UserProfile />;
}
