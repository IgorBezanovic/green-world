import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { BlogPost } from '@green-world/views/BlogPost';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createPageMetadata({
    locale: appLocale,
    pathname: '/blog',
    title: messages.seo.blog.title,
    description: messages.seo.blog.description,
    keywords: messages.seo.blog.keywords
  });
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPost />
    </Suspense>
  );
}
