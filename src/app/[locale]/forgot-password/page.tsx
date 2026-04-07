import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ForgotPassword } from '@green-world/views/ForgotPassword';
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
    pathname: '/forgot-password',
    title: messages.forgotPasswordView.breadcrumb,
    noIndex: true
  });
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
