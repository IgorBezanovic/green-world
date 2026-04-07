import {
  createLocalizedPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { WritePost } from '@green-world/views/WritePost';
import type { Metadata } from 'next';

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

export default function EditPostPage() {
  return <WritePost />;
}
