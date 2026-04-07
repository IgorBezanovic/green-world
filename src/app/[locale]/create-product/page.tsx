import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { CreateEditProduct } from '@green-world/views/CreateEditProduct';
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
    pathname: '/create-product',
    title: messages.createEditProduct.pageTitleCreate,
    noIndex: true
  });
}

export default function CreateProductPage() {
  return <CreateEditProduct />;
}
