import {
  buildProductMetadata,
  fetchApiData,
  getLocalizedPathname,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { Product } from '@green-world/utils/types';
import { ProductPage } from '@green-world/views/ProductPage';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  return buildProductMetadata(normalizeLocale(locale), productId);
}

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ locale: string; productId: string }>;
}) {
  const { locale, productId } = await params;
  const appLocale = normalizeLocale(locale);
  const product = await fetchApiData<Product>(`/product/details/${productId}`);
  const canonicalSegment = product?.slug || productId;

  if (product && canonicalSegment !== productId) {
    redirect(getLocalizedPathname(appLocale, `/product/${canonicalSegment}`));
  }

  return <ProductPage />;
}
