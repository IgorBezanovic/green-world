import { EditUserChangePassword } from '@green-world/components/EditUser';
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
    pathname: '/profile-settings/change-password',
    title: messages.editUserChangePassword.pageTitle,
    noIndex: true
  });
}

export default function ChangePasswordPage() {
  return <EditUserChangePassword />;
}
