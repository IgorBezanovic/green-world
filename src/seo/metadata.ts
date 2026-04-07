import { en } from '@green-world/i18n/locales/en';
import { ru } from '@green-world/i18n/locales/ru';
import { sr } from '@green-world/i18n/locales/sr';
import { routing } from '@green-world/i18n/routing';
import type {
  BlogPost,
  Event,
  Product,
  ServiceListing,
  User
} from '@green-world/utils/types';
import type { Metadata } from 'next';

const SITE_NAME = 'Zeleni Svet';
const SITE_URL = 'https://www.zelenisvet.rs';
const DEFAULT_OG_IMAGE = '/opengraph-image';
const DEFAULT_OG_WIDTH = 1200;
const DEFAULT_OG_HEIGHT = 630;
const TITLE_SEPARATOR = ' | ';
const SITE_TITLE_ALIASES = new Set([SITE_NAME.toLowerCase(), 'green world']);

const OG_LOCALE_BY_LANGUAGE = {
  sr: 'sr_RS',
  en: 'en_US',
  ru: 'ru_RU'
} as const;

const messagesByLocale = {
  sr,
  en,
  ru
} as const;

export type AppLocale = keyof typeof messagesByLocale;

type MetadataInput = {
  locale: AppLocale;
  title: string;
  description: string;
  keywords?: Metadata['keywords'];
  image?: string;
  pathname?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
};

const getApiBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';

export const normalizeLocale = (locale?: string | null): AppLocale => {
  if (locale && locale in messagesByLocale) {
    return locale as AppLocale;
  }

  return routing.defaultLocale as AppLocale;
};

export const getLocaleMessages = (locale?: string | null) =>
  messagesByLocale[normalizeLocale(locale)];

export const getLocalizedPathname = (
  locale: AppLocale,
  pathname: string = '/'
) => {
  const normalizedPathname = pathname.startsWith('/')
    ? pathname
    : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalizedPathname;
  }

  if (normalizedPathname === '/') {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPathname}`;
};

export const absoluteUrl = (value?: string | null) => {
  if (!value) {
    return `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(
    value.startsWith('/') ? value : `/${value}`,
    SITE_URL
  ).toString();
};

export const toAssetImageUrl = (value?: string | null, quality = 85) => {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const env = process.env.NEXT_PUBLIC_ENV;

  if (!bucket || !region || !env) {
    return undefined;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${env}/${value}_${quality}.webp`;
};

export const stripHtml = (value?: string | null) => {
  if (!value) {
    return '';
  }

  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const truncate = (value: string, maxLength = 180) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
};

const createEntityTitle = (
  entityTitle: string | null | undefined,
  entityType: string
) => {
  if (!entityTitle) {
    return [SITE_NAME, entityType].join(TITLE_SEPARATOR);
  }

  return [SITE_NAME, entityTitle, entityType].join(TITLE_SEPARATOR);
};

const splitTitleSegments = (value: string) =>
  value
    .split(TITLE_SEPARATOR)
    .map((segment) => segment.trim())
    .filter(Boolean);

export const createAppTitle = (
  ...segments: Array<string | null | undefined>
) => {
  const normalizedSegments = segments.flatMap((segment) => {
    if (!segment) {
      return [];
    }

    return splitTitleSegments(segment).filter(
      (titleSegment) => !SITE_TITLE_ALIASES.has(titleSegment.toLowerCase())
    );
  });

  return [SITE_NAME, ...normalizedSegments].join(TITLE_SEPARATOR);
};

const buildRobots = (noIndex?: boolean): Metadata['robots'] | undefined => {
  if (!noIndex) {
    return undefined;
  }

  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  };
};

export const createPageMetadata = ({
  locale,
  title,
  description,
  keywords,
  image,
  pathname,
  type = 'website',
  noIndex
}: MetadataInput): Metadata => {
  const localizedPathname = pathname
    ? getLocalizedPathname(locale, pathname)
    : undefined;
  const canonicalUrl = localizedPathname
    ? absoluteUrl(localizedPathname)
    : undefined;
  const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);

  return {
    title: {
      absolute: title
    },
    description,
    keywords,
    alternates: localizedPathname
      ? {
          canonical: localizedPathname
        }
      : undefined,
    robots: buildRobots(noIndex),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE_BY_LANGUAGE[locale],
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_WIDTH,
          height: DEFAULT_OG_HEIGHT,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl]
    }
  };
};

type LocalizedPageMetadataInput = Omit<
  MetadataInput,
  'title' | 'description'
> & {
  title: string;
  description?: string;
};

export const createLocalizedPageMetadata = ({
  locale,
  title,
  description,
  keywords,
  image,
  pathname,
  type,
  noIndex
}: LocalizedPageMetadataInput): Metadata => {
  const messages = getLocaleMessages(locale);

  return createPageMetadata({
    locale,
    title: createAppTitle(title),
    description: description ?? messages.metaTags.defaultDescription,
    keywords: keywords ?? messages.metaTags.defaultKeywords,
    image,
    pathname,
    type,
    noIndex
  });
};

export const createLocaleFallbackMetadata = (locale: AppLocale): Metadata => {
  const messages = getLocaleMessages(locale);

  return createPageMetadata({
    locale,
    title: messages.seo.home.title,
    description: messages.metaTags.defaultDescription,
    keywords: messages.metaTags.defaultKeywords,
    image: DEFAULT_OG_IMAGE
  });
};

export const fetchApiData = async <T>(endpoint: string): Promise<T | null> => {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return (payload?.data ?? payload) as T;
  } catch {
    return null;
  }
};

export const buildProductMetadata = async (
  locale: AppLocale,
  productId: string
) => {
  const messages = getLocaleMessages(locale);
  const product = await fetchApiData<Product>(`/product/details/${productId}`);

  return createPageMetadata({
    locale,
    pathname: `/product/${productId}`,
    title: createEntityTitle(product?.title, messages.seo.product.label),
    description: truncate(
      stripHtml(
        product?.description ||
          product?.shortDescription ||
          messages.seo.product.fallbackDescription
      )
    ),
    keywords: product?.shortDescription || messages.metaTags.defaultKeywords,
    image: toAssetImageUrl(product?.images?.[0]) || DEFAULT_OG_IMAGE
  });
};

export const buildEventMetadata = async (
  locale: AppLocale,
  eventId: string
) => {
  const messages = getLocaleMessages(locale);
  const event = await fetchApiData<Event>(`/action/details/${eventId}`);

  return createPageMetadata({
    locale,
    pathname: `/event/${eventId}`,
    title: createEntityTitle(event?.title, messages.seo.event.label),
    description: truncate(
      stripHtml(event?.description || messages.seo.event.fallbackDescription)
    ),
    keywords:
      stripHtml(event?.description) || messages.metaTags.defaultKeywords,
    image: toAssetImageUrl(event?.coverImage) || DEFAULT_OG_IMAGE
  });
};

const getBlogDescription = (post: BlogPost | null, fallback: string) => {
  const firstTextBlock = post?.blocks?.find((block) =>
    Boolean(block.text)
  )?.text;
  return truncate(stripHtml(firstTextBlock || fallback));
};

export const buildBlogPostMetadata = async (
  locale: AppLocale,
  postId: string
) => {
  const messages = getLocaleMessages(locale);
  const post = await fetchApiData<BlogPost>(`/blog-post/post/${postId}`);
  const title = createEntityTitle(post?.title, messages.topContent.blog);

  return createPageMetadata({
    locale,
    pathname: `/blog/${postId}`,
    title,
    description: getBlogDescription(post, messages.seo.blog.description),
    keywords: post?.keywords?.join(', ') || messages.seo.blog.keywords,
    image: toAssetImageUrl(post?.coverImage) || DEFAULT_OG_IMAGE,
    type: 'article'
  });
};

export const buildShopMetadata = async (locale: AppLocale, userId: string) => {
  const messages = getLocaleMessages(locale);
  const user = await fetchApiData<User>(`/user/details/${userId}`);
  const profileLabel = messages.breadcrumbs.userProfile;
  const shopTitle = user?.shopName || user?.name;

  return createPageMetadata({
    locale,
    pathname: `/shop/${userId}`,
    title: createEntityTitle(shopTitle, profileLabel),
    description: truncate(
      stripHtml(
        user?.shopDescription || messages.shopPage.meta.descriptionFallback
      )
    ),
    keywords: user?.shopName || messages.metaTags.defaultKeywords,
    image: toAssetImageUrl(user?.profileImage, 120) || DEFAULT_OG_IMAGE,
    type: 'profile'
  });
};

export const buildServiceMetadata = async (
  locale: AppLocale,
  serviceId: string
) => {
  const messages = getLocaleMessages(locale);
  const service = await fetchApiData<ServiceListing>(`/services/${serviceId}`);
  const serviceLabel = messages.topContent.service;

  return createPageMetadata({
    locale,
    pathname: `/services/${serviceId}`,
    title: createEntityTitle(service?.title, serviceLabel),
    description: truncate(
      stripHtml(service?.description || messages.metaTags.defaultDescription)
    ),
    keywords:
      service?.services?.join(', ') || messages.metaTags.defaultKeywords,
    image: toAssetImageUrl(service?.images?.[0]) || DEFAULT_OG_IMAGE
  });
};

export const buildOrderProductMetadata = async (
  locale: AppLocale,
  productId: string
) => {
  const messages = getLocaleMessages(locale);
  const product = await fetchApiData<Product>(`/product/details/${productId}`);
  const title = product?.title
    ? [messages.orderProductView.breadcrumb, product.title].join(
        TITLE_SEPARATOR
      )
    : messages.orderProductView.breadcrumb;

  return createLocalizedPageMetadata({
    locale,
    pathname: `/order-product/${productId}`,
    title,
    description: truncate(
      stripHtml(
        product?.description ||
          messages.orderProductView.metaFallbackDescription
      )
    ),
    keywords:
      stripHtml(product?.shortDescription || product?.description) ||
      messages.metaTags.defaultKeywords,
    image: toAssetImageUrl(product?.images?.[0]) || DEFAULT_OG_IMAGE,
    noIndex: true
  });
};
