import {
  buildEventMetadata,
  fetchApiData,
  getLocalizedPathname,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { Event as EventData } from '@green-world/utils/types';
import { Event } from '@green-world/views/Event';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; eventId: string }>;
}): Promise<Metadata> {
  const { locale, eventId } = await params;
  return buildEventMetadata(normalizeLocale(locale), eventId);
}

export default async function EventDetailsPage({
  params
}: {
  params: Promise<{ locale: string; eventId: string }>;
}) {
  const { locale, eventId } = await params;
  const appLocale = normalizeLocale(locale);
  const event = await fetchApiData<EventData>(`/action/details/${eventId}`);
  const canonicalSegment = event?.slug || eventId;

  if (event && canonicalSegment !== eventId) {
    redirect(getLocalizedPathname(appLocale, `/event/${canonicalSegment}`));
  }

  return <Event />;
}
