import { buildEventMetadata, normalizeLocale } from '@green-world/seo/metadata';
import { Event } from '@green-world/views/Event';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; eventId: string }>;
}): Promise<Metadata> {
  const { locale, eventId } = await params;
  return buildEventMetadata(normalizeLocale(locale), eventId);
}

export default function EventDetailsPage() {
  return <Event />;
}
