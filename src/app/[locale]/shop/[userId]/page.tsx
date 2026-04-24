import {
  buildShopMetadata,
  fetchApiData,
  getLocalizedPathname,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { User } from '@green-world/utils/types';
import { ShopPage } from '@green-world/views/ShopPage';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; userId: string }>;
}): Promise<Metadata> {
  const { locale, userId } = await params;
  return buildShopMetadata(normalizeLocale(locale), userId);
}

export default async function ShopDetailsPage({
  params
}: {
  params: Promise<{ locale: string; userId: string }>;
}) {
  const { locale, userId } = await params;
  const appLocale = normalizeLocale(locale);
  const user = await fetchApiData<User>(`/user/details/${userId}`);
  const canonicalSegment = user?.slug || userId;

  if (user && canonicalSegment !== userId) {
    redirect(getLocalizedPathname(appLocale, `/shop/${canonicalSegment}`));
  }

  return <ShopPage />;
}
