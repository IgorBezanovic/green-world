import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Home } from '@green-world/views/Home';
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
    pathname: '/',
    title: messages.seo.home.title,
    description: messages.seo.home.description,
    keywords: messages.seo.home.keywords
  });
}

export default function HomePage() {
  return <Home />;
}
