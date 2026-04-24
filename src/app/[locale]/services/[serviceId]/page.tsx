import {
  buildServiceMetadata,
  fetchApiData,
  getLocalizedPathname,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { ServiceListing } from '@green-world/utils/types';
import { ServiceDetailsPage } from '@green-world/views/ServiceDetails';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}): Promise<Metadata> {
  const { locale, serviceId } = await params;
  return buildServiceMetadata(normalizeLocale(locale), serviceId);
}

export default async function ServiceDetailsRoutePage({
  params
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}) {
  const { locale, serviceId } = await params;
  const appLocale = normalizeLocale(locale);
  const service = await fetchApiData<ServiceListing>(`/services/${serviceId}`);
  const canonicalSegment = service?.slug || serviceId;

  if (service && canonicalSegment !== serviceId) {
    redirect(getLocalizedPathname(appLocale, `/services/${canonicalSegment}`));
  }

  return <ServiceDetailsPage />;
}
