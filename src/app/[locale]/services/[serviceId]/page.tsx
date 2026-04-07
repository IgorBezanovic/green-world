import {
  buildServiceMetadata,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ServiceDetailsPage } from '@green-world/views/ServiceDetails';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}): Promise<Metadata> {
  const { locale, serviceId } = await params;
  return buildServiceMetadata(normalizeLocale(locale), serviceId);
}

export default function ServiceDetailsRoutePage() {
  return <ServiceDetailsPage />;
}
