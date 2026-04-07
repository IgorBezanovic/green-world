import {
  buildOrderProductMetadata,
  normalizeLocale
} from '@green-world/seo/metadata';
import { OrderProduct } from '@green-world/views/OrderProduct';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; productId: string }>;
}): Promise<Metadata> {
  const { locale, productId } = await params;
  return buildOrderProductMetadata(normalizeLocale(locale), productId);
}

export default function OrderProductPage() {
  return <OrderProduct />;
}
