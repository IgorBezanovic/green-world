import { EditUserImageSection } from '@green-world/components/EditUser';
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
    pathname: '/profile-settings/change-image',
    title: messages.profileSettingsView.buttons.imageQr,
    noIndex: true
  });
}

export default function ChangeImagePage() {
  return <EditUserImageSection />;
}
