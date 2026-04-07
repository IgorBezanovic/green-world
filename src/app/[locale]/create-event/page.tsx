import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { CreateEditEvent } from '@green-world/views/CreateEditEvent';
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
    pathname: '/create-event',
    title: messages.createEditEvent.pageTitleCreate,
    noIndex: true
  });
}

export default function CreateEventPage() {
  return <CreateEditEvent />;
}
