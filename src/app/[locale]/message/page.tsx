import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Message } from '@green-world/views/Message';
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
    pathname: '/message',
    title: messages.seo.message.title,
    description: messages.seo.message.description,
    keywords: messages.seo.message.keywords,
    noIndex: true
  });
}

export default function MessagePage() {
  return <Message />;
}
