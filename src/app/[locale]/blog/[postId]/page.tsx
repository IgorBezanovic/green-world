import {
  buildBlogPostMetadata,
  normalizeLocale
} from '@green-world/seo/metadata';
import { BlogPostPage } from '@green-world/views/BlogPostPage';
import type { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; postId: string }>;
}): Promise<Metadata> {
  const { locale, postId } = await params;
  return buildBlogPostMetadata(normalizeLocale(locale), postId);
}

export default function BlogPostDetailsPage() {
  return <BlogPostPage />;
}
