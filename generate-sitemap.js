import 'dotenv/config';
import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { SitemapStream, streamToPromise } from 'sitemap';

async function generateSitemap() {
  const hostname = 'https://greenworldbe-production.up.railway.app';
  const smStream = new SitemapStream({ hostname: 'https://zelenisvet.rs' });

  const formatImageUrl = (url, quality) => {
    if (!url) return '';
    const { VITE_AWS_BUCKET_NAME, VITE_AWS_REGION } = process.env;

    return url.includes('cloudinary')
      ? url
      : `https://${VITE_AWS_BUCKET_NAME}.s3.${VITE_AWS_REGION}.amazonaws.com/prod/${url}_${quality || 85}.webp`;
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

  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: '/login',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: '/registration',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      url: '/forgot-password',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/profile',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/profile-settings/edit-profile',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/profile-settings/change-image',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/profile-settings/change-password',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/search',
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
      url: '/create-product',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: '/create-event',
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
      url: '/admin/google-analytics',
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
  ];

  // statične stranice
  staticPages.forEach((page) => smStream.write(page));

  // API proizvoda
  const products = await fetchAllItems('/api/product/all', 'products');
  products.forEach((p) =>
    smStream.write({
      url: `/product/${p._id}`,
      changefreq: 'daily',
      priority: 1,
      img: [
        {
          url: formatImageUrl(p.images?.[0] || ''), // glavna slika
          title: p.title || '', // naslov proizvoda
          caption: p.description || '' // opis kao caption
        }
      ]
    })
  );

  // API dogadjaja
  const events = await fetchAllItems('/api/action/all', 'events');
  events.forEach((e) =>
    smStream.write({
      url: `/event/${e._id}`,
      changefreq: 'daily',
      priority: 1,
      img: [
        {
          url: formatImageUrl(e.coverImage || ''), // glavna slika
          title: e.title || '', // naslov događaja
          caption: e.description || '' // opis kao caption
        }
      ]
    })
  );

  // API usluga
  const services = await fetchAllItems('/api/services', 'services');
  services.forEach((s) =>
    smStream.write({
      url: `/services/${s._id}`,
      changefreq: 'daily',
      priority: 1,
      img: [
        {
          url: formatImageUrl(s.images?.[0] || ''),
          title: s.title || '',
          caption: s.description || ''
        }
      ]
    })
  );

  // API user-a
  const users = await fetchAllItems('/api/user/all-users', 'users');
  users.forEach((u) =>
    smStream.write({
      url: `/shop/${u._id}`,
      changefreq: 'daily',
      priority: 1,
      img: [
        {
          url: formatImageUrl(u.profileImage || ''),
          title: u.shopName || u.name || '',
          caption: u.shopDescription || ''
        }
      ]
    })
  );

  smStream.end();

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
  writeFileSync('./public/sitemap.xml', sitemap);

  console.log('✅ Sitemap generisan!');
}

generateSitemap().catch(console.error);
