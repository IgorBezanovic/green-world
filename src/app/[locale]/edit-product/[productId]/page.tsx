import {
  createLocalizedPageMetadata,
  fetchApiData,
  getLocalizedPathname,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { Product } from '@green-world/utils/types';
import { CreateEditProduct } from '@green-world/views/CreateEditProduct';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

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

export default async function EditProductPage({
  params
}: {
  params: Promise<{ locale: string; productId: string }>;
}) {
  const { locale, productId } = await params;
  const appLocale = normalizeLocale(locale);
  const product = await fetchApiData<Product>(`/product/details/${productId}`);
  const canonicalSegment = product?.slug || productId;

  if (product && canonicalSegment !== productId) {
    redirect(
      getLocalizedPathname(appLocale, `/edit-product/${canonicalSegment}`)
    );
  }

  return <CreateEditProduct />;
}
