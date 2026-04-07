import { buildShopMetadata, normalizeLocale } from '@green-world/seo/metadata';
import { ShopPage } from '@green-world/views/ShopPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; userId: string }>;
}): Promise<Metadata> {
  const { locale, userId } = await params;
  return buildShopMetadata(normalizeLocale(locale), userId);
}

export default function ShopDetailsPage() {
  return <ShopPage />;
}
