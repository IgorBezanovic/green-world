import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { SitemapStream, streamToPromise } from 'sitemap';

// Load env values from common Next.js dotenv files so this script works in hook/CI runs too.
dotenv.config();
dotenv.config({ path: '.env.local', override: false });
dotenv.config({ path: '.env.production', override: false });
dotenv.config({ path: '.env.production.local', override: false });

async function generateSitemap() {
  const hostname = 'https://greenworldbe-production.up.railway.app';
  const siteHostname = 'https://www.zelenisvet.rs';
  const smStream = new SitemapStream({ hostname: siteHostname });

  const nowIso = new Date().toISOString();

  const awsBucketName =
    process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
  const awsRegion =
    process.env.NEXT_PUBLIC_AWS_REGION || process.env.AWS_REGION;

  const formatImageUrl = (url, quality) => {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    if (!awsBucketName || !awsRegion) return '';

    return url.includes('cloudinary')
      ? url
      : `https://${awsBucketName}.s3.${awsRegion}.amazonaws.com/prod/${url}_${quality || 85}.webp`;
  };

  const toIsoDate = (value) => {
    if (!value) return nowIso;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? nowIso : parsed.toISOString();
  };

  const writeEntry = (entry) => smStream.write(entry);

  const writeEntryWithImage = (entry, image) => {
    if (image?.url) {
      writeEntry({ ...entry, img: [image] });
      return;
    }

    writeEntry(entry);
  };

  const extractItems = (payload, legacyKey) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (legacyKey && Array.isArray(payload?.[legacyKey])) {
      return payload[legacyKey];
    }
    return [];
  };

  const fetchAllItems = async (endpoint, legacyKey) => {
    const items = [];
    let page = 1;
    let pages = 1;

    do {
      const separator = endpoint.includes('?') ? '&' : '?';
      const res = await fetch(
        `${hostname}${endpoint}${separator}page=${page}&pageSize=100`
      );
      const payload = await res.json();
      const pageItems = extractItems(payload, legacyKey);
      items.push(...pageItems);

      if (!payload?.meta) break;
      pages = Number(payload.meta.pages) || 1;
      page += 1;
    } while (page <= pages);

    return items;
  };

  const nonIndexableStaticRoutes = new Set([
    '/login',
    '/registration',
    '/profile',
    '/profile-settings/edit-profile',
    '/profile-settings/change-image',
    '/profile-settings/change-password',
    '/create-product',
    '/create-event'
  ]);

  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: '/products',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/events',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/contact-us',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/message',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/privacy-policy',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/flower_assortment',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/succulents',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/potted_flowers',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/seedlings',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/fruits_and_vegetables',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/herbal_pharmacy',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/garden_decoration',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search/everything_for_plants',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/shops',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/documents',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/blog',
      changefreq: 'daily',
      priority: 0.9
    }
  ].filter((page) => !nonIndexableStaticRoutes.has(page.url));

  // statične stranice
  staticPages.forEach((page) =>
    writeEntry({
      ...page,
      lastmod: nowIso
    })
  );

  // API proizvoda
  const products = await fetchAllItems('/api/product/all', 'products');
  products.forEach((p) => {
    const imageUrl = formatImageUrl(p.images?.[0] || '');
    writeEntryWithImage(
      {
        url: `/product/${p._id}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: toIsoDate(p.updatedAt || p.createdAt)
      },
      {
        url: imageUrl, // glavna slika
        title: p.title || '', // naslov proizvoda
        caption: p.description || '' // opis kao caption
      }
    );
  });

  // API dogadjaja
  const events = await fetchAllItems('/api/action/all', 'events');
  events.forEach((e) => {
    const imageUrl = formatImageUrl(e.coverImage || '');
    writeEntryWithImage(
      {
        url: `/event/${e._id}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: toIsoDate(e.updatedAt || e.createdAt)
      },
      {
        url: imageUrl, // glavna slika
        title: e.title || '', // naslov događaja
        caption: e.description || '' // opis kao caption
      }
    );
  });

  // API usluga
  const services = await fetchAllItems('/api/services', 'services');
  services.forEach((s) => {
    const imageUrl = formatImageUrl(s.images?.[0] || '');
    writeEntryWithImage(
      {
        url: `/services/${s._id}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: toIsoDate(s.updatedAt || s.createdAt)
      },
      {
        url: imageUrl,
        title: s.title || '',
        caption: s.description || ''
      }
    );
  });

  // API user-a
  const users = await fetchAllItems('/api/user/all-users', 'users');
  users.forEach((u) => {
    const imageUrl = formatImageUrl(u.profileImage || '');
    writeEntryWithImage(
      {
        url: `/shop/${u._id}`,
        changefreq: 'daily',
        priority: 1,
        lastmod: toIsoDate(u.updatedAt || u.createdAt)
      },
      {
        url: imageUrl,
        title: u.shopName || u.name || '',
        caption: u.shopDescription || ''
      }
    );
  });

  smStream.end();

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
  writeFileSync('./public/sitemap.xml', sitemap);

  console.log('✅ Sitemap generisan!');
}

generateSitemap().catch(console.error);
