import {
  buildBlogPostMetadata,
  fetchApiData,
  getLocalizedPathname,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { BlogPost } from '@green-world/utils/types';
import { BlogPostPage } from '@green-world/views/BlogPostPage';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; postId: string }>;
}): Promise<Metadata> {
  const { locale, postId } = await params;
  return buildBlogPostMetadata(normalizeLocale(locale), postId);
}

export default async function BlogPostDetailsPage({
  params
}: {
  params: Promise<{ locale: string; postId: string }>;
}) {
  const { locale, postId } = await params;
  const appLocale = normalizeLocale(locale);
  const post = await fetchApiData<BlogPost>(`/blog-post/post/${postId}`);
  const canonicalSegment = post?.slug || postId;

  if (post && canonicalSegment !== postId) {
    redirect(getLocalizedPathname(appLocale, `/blog/${canonicalSegment}`));
  }

  return <BlogPostPage />;
}
