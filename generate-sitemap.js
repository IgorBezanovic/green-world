import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { SitemapStream, streamToPromise } from 'sitemap';

async function generateSitemap() {
  const hostname = 'https://green-world-be-prod.onrender.com';
  const smStream = new SitemapStream({ hostname: 'https://zelenisvet.rs' });

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/login', changefreq: 'monthly', priority: 0.8 },
    { url: '/registration', changefreq: 'monthly', priority: 0.8 },
    { url: '/forgot-password', changefreq: 'daily', priority: 0.9 },
    { url: '/profile', changefreq: 'daily', priority: 0.9 },
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
    { url: '/search', changefreq: 'daily', priority: 0.9 },
    { url: '/contact-us', changefreq: 'daily', priority: 0.9 },
    { url: '/create-product', changefreq: 'daily', priority: 0.9 },
    { url: '/create-event', changefreq: 'daily', priority: 0.9 },
    { url: '/privacy-policy', changefreq: 'daily', priority: 0.9 },
    { url: '/search/flower_assortment', changefreq: 'daily', priority: 0.9 },
    { url: '/search/succulents', changefreq: 'daily', priority: 0.9 },
    { url: '/search/potted_flowers', changefreq: 'daily', priority: 0.9 },
    { url: '/search/seedlings', changefreq: 'daily', priority: 0.9 },
    {
      url: '/search/fruits_and_vegetables',
      changefreq: 'daily',
      priority: 0.9
    },
    { url: '/search/herbal_pharmacy', changefreq: 'daily', priority: 0.9 },
    { url: '/search/garden_decoration', changefreq: 'daily', priority: 0.9 },
    { url: '/search/everything_for_plants', changefreq: 'daily', priority: 0.9 }
  ];

  // statične stranice
  staticPages.forEach((page) => smStream.write(page));

  // API proizvoda
  const resProduct = await fetch(`${hostname}/api/product/all`);
  const products = await resProduct.json();
  products.products.forEach((p) =>
    smStream.write({
      url: `/product/${p._id}`,
      changefreq: 'weekly',
      priority: 0.8
    })
  );

  // API dogadjaja
  const resEvent = await fetch(`${hostname}/api/action/all`);
  const event = await resEvent.json();
  event.forEach((p) =>
    smStream.write({
      url: `/event/${p._id}`,
      changefreq: 'weekly',
      priority: 0.8
    })
  );

  smStream.end();

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
  writeFileSync('./public/sitemap.xml', sitemap);

  console.log('✅ Sitemap generisan!');
}

generateSitemap().catch(console.error);
