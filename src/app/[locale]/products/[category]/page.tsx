import {
  createAppTitle,
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Products } from '@green-world/views/Products';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);
  const categoryGroups = messages.catalog.groups;
  const categorySubtitles = messages.home.sectionSubtitles;
  const categoryLabel =
    categoryGroups[category as keyof typeof categoryGroups] || category;
  const categoryDescription =
    categorySubtitles[category as keyof typeof categorySubtitles] ||
    messages.metaTags.defaultDescription;

  return createPageMetadata({
    locale: appLocale,
    pathname: `/products/${category}`,
    title: createAppTitle(categoryLabel, messages.breadcrumbs.products),
    description: categoryDescription,
    keywords: [categoryLabel, messages.breadcrumbs.products].join(', ')
  });
}

export default function SearchCategoryPage() {
  return (
    <Suspense>
      <Products />
    </Suspense>
  );
}
