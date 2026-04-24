import {
  createLocalizedPageMetadata,
  fetchApiData,
  getLocalizedPathname,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { Event as EventData } from '@green-world/utils/types';
import { CreateEditEvent } from '@green-world/views/CreateEditEvent';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

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

export default async function EditEventPage({
  params
}: {
  params: Promise<{ locale: string; eventID: string }>;
}) {
  const { locale, eventID } = await params;
  const appLocale = normalizeLocale(locale);
  const event = await fetchApiData<EventData>(`/action/details/${eventID}`);
  const canonicalSegment = event?.slug || eventID;

  if (event && canonicalSegment !== eventID) {
    redirect(
      getLocalizedPathname(appLocale, `/edit-event/${canonicalSegment}`)
    );
  }

  return <CreateEditEvent />;
}
