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
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createLocalizedPageMetadata({
    locale: appLocale,
    pathname: `/edit-product/${productId}`,
    title: messages.createEditProduct.pageTitleEdit,
    noIndex: true
  });
}

export default function EditProductPage() {
  return <CreateEditProduct />;
}
