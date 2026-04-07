import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Documents } from '@green-world/views/Documents';
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
    pathname: '/documents',
    title: messages.seo.documents.title,
    description: messages.seo.documents.description,
    keywords: messages.seo.documents.keywords
  });
}

export default function DocumentsPage() {
  return <Documents />;
}
