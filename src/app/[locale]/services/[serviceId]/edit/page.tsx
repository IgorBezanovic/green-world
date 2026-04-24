import {
  createLocalizedPageMetadata,
  fetchApiData,
  getLocalizedPathname,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { ServiceListing } from '@green-world/utils/types';
import { CreateEditService } from '@green-world/views/CreateEditService';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}): Promise<Metadata> {
  const { locale, serviceId } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createLocalizedPageMetadata({
    locale: appLocale,
    pathname: `/services/${serviceId}/edit`,
    title: messages.service.editService,
    noIndex: true
  });
}

export default async function EditServicePage({
  params
}: {
  params: Promise<{ locale: string; serviceId: string }>;
}) {
  const { locale, serviceId } = await params;
  const appLocale = normalizeLocale(locale);
  const service = await fetchApiData<ServiceListing>(`/services/${serviceId}`);
  const canonicalSegment = service?.slug || serviceId;

  if (service && canonicalSegment !== serviceId) {
    redirect(
      getLocalizedPathname(appLocale, `/services/${canonicalSegment}/edit`)
    );
  }

  return <CreateEditService />;
}
