import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { PrivacyPolicy } from '@green-world/views/PrivacyPolicy';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createPageMetadata({
    locale: appLocale,
    pathname: '/privacy-policy',
    title: messages.seo.privacyPolicy.title,
    description: messages.seo.privacyPolicy.description,
    keywords: messages.seo.privacyPolicy.keywords
  });
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
