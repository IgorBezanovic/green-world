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
  params: Promise<{ locale: string; eventID: string }>;
}): Promise<Metadata> {
  const { locale, eventID } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createLocalizedPageMetadata({
    locale: appLocale,
    pathname: `/edit-event/${eventID}`,
    title: messages.createEditEvent.pageTitleEdit,
    noIndex: true
  });
}

export default function EditEventPage() {
  return <CreateEditEvent />;
}
