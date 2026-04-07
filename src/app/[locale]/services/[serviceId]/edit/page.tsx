import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { CreateEditService } from '@green-world/views/CreateEditService';
import type { Metadata } from 'next';

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

export default function EditServicePage() {
  return <CreateEditService />;
}
