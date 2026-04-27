const SITE_URL = 'https://www.zelenisvet.rs';
const PRODUCT_URL_BASE = `${SITE_URL}/product`;
const DEFAULT_BRAND = 'Zeleni Svet';
const DEFAULT_IMAGE = `${SITE_URL}/zeleni-svet-yellow-transparent.png`;

type FeedProduct = {
  _id?: string;
  slug?: string;
  title?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  images?: string[];
  onStock?: boolean;
};

type ProductsResponse = {
  data?: FeedProduct[];
  meta?: {
    pages?: number;
  };
};

const escapeXml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const stripHtml = (value?: string): string => {
  if (!value) return '';

  return value
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const toAbsoluteImageUrl = (value?: string): string => {
  if (!value) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;

  const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const env = process.env.NEXT_PUBLIC_ENV;

  if (!bucket || !region || !env) {
    return DEFAULT_IMAGE;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${env}/${value}_85.webp`;
};

const getApiBaseUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;

  return 'https://greenworldbe-production.up.railway.app/api';
};

const normalizePrice = (price?: number): string => {
  const numeric = Number.isFinite(price) ? Number(price) : 0;
  return `${numeric.toFixed(2)} RSD`;
};

const toFeedItemXml = (product: FeedProduct): string => {
  const id = product._id || product.slug || 'unknown-product';
  const slugOrId = product.slug || product._id || 'unknown-product';
  const title = product.title?.trim() || 'Proizvod';
  const descriptionText =
    stripHtml(product.description) ||
    stripHtml(product.shortDescription) ||
    'Proizvod sa Zeleni Svet platforme.';

  const image = toAbsoluteImageUrl(product.images?.[0]);
  const availability = product.onStock ? 'in stock' : 'out of stock';

  return [
    '    <item>',
    `      <g:id>${escapeXml(id)}</g:id>`,
    `      <g:title>${escapeXml(title)}</g:title>`,
    `      <g:description>${escapeXml(descriptionText)}</g:description>`,
    `      <g:link>${escapeXml(`${PRODUCT_URL_BASE}/${encodeURIComponent(slugOrId)}`)}</g:link>`,
    `      <g:image_link>${escapeXml(image)}</g:image_link>`,
    `      <g:price>${escapeXml(normalizePrice(product.price))}</g:price>`,
    `      <g:availability>${availability}</g:availability>`,
    '      <g:condition>new</g:condition>',
    `      <g:brand>${DEFAULT_BRAND}</g:brand>`,
    '    </item>'
  ].join('\n');
};

const fetchAllProducts = async (): Promise<FeedProduct[]> => {
  const apiBaseUrl = getApiBaseUrl();
  const pageSize = 100;
  const all: FeedProduct[] = [];

  let page = 1;
  let pages = 1;

  do {
    const url = `${apiBaseUrl}/product/all?page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products page ${page}`);
    }

    const payload = (await response.json()) as ProductsResponse;
    const pageItems = Array.isArray(payload.data) ? payload.data : [];

    all.push(...pageItems);

    const totalPages = Number(payload.meta?.pages || 1);
    pages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
    page += 1;
  } while (page <= pages);

  return all;
};

export async function GET(): Promise<Response> {
  try {
    const products = await fetchAllProducts();
    const itemsXml = products.map(toFeedItemXml).join('\n');

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
      '  <channel>',
      '    <title>Zeleni Svet Product Feed</title>',
      `    <link>${SITE_URL}</link>`,
      '    <description>Google Merchant Center feed for Zeleni Svet products.</description>',
      itemsXml,
      '  </channel>',
      '</rss>'
    ].join('\n');

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  } catch {
    const fallbackXml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
      '  <channel>',
      '    <title>Zeleni Svet Product Feed</title>',
      `    <link>${SITE_URL}</link>`,
      '    <description>Google Merchant Center feed for Zeleni Svet products.</description>',
      '  </channel>',
      '</rss>'
    ].join('\n');

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  }
}
