import {
  createLocalizedPageMetadata,
  fetchApiData,
  getLocalizedPathname,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import type { BlogPost } from '@green-world/utils/types';
import { WritePost } from '@green-world/views/WritePost';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; postId: string }>;
}): Promise<Metadata> {
  const { locale, postId } = await params;
  const appLocale = normalizeLocale(locale);
  const messages = getLocaleMessages(appLocale);

  return createLocalizedPageMetadata({
    locale: appLocale,
    pathname: `/write-post/${postId}`,
    title: messages.writePost.pageTitleEdit,
    description: messages.seo.writePost.description,
    keywords: messages.seo.writePost.keywords,
    noIndex: true
  });
}

export default async function EditPostPage({
  params
}: {
  params: Promise<{ locale: string; postId: string }>;
}) {
  const { locale, postId } = await params;
  const appLocale = normalizeLocale(locale);
  const post = await fetchApiData<BlogPost>(`/blog-post/post/${postId}`);
  const canonicalSegment = post?.slug || postId;

  if (post && canonicalSegment !== postId) {
    redirect(
      getLocalizedPathname(appLocale, `/write-post/${canonicalSegment}`)
    );
  }

  return <WritePost />;
}
