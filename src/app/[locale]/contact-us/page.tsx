import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ContactUs } from '@green-world/views/ContactUs';
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
    pathname: '/contact-us',
    title: messages.seo.contactUs.title,
    description: messages.seo.contactUs.description,
    keywords: messages.seo.contactUs.keywords
  });
}

export default function ContactUsPage() {
  return <ContactUs />;
}
