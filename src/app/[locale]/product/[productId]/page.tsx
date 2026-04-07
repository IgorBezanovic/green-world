import {
  buildProductMetadata,
  normalizeLocale
} from '@green-world/seo/metadata';
import { ProductPage } from '@green-world/views/ProductPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  return buildProductMetadata(normalizeLocale(locale), productId);
}

export default function ProductDetailsPage() {
  return <ProductPage />;
}
