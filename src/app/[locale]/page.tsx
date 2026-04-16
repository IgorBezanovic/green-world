import {
  createPageMetadata,
  getLocaleMessages,
  normalizeLocale
} from '@green-world/seo/metadata';
import { Home } from '@green-world/views/Home';
import type { Metadata } from 'next';

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
    pathname: '/',
    title: messages.seo.home.title,
    description: messages.seo.home.description,
    keywords: messages.seo.home.keywords
  });
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zeleni Svet',
  url: 'https://www.zelenisvet.rs',
  description:
    'Online cveće i biljke – kupovina cveća direktno od cvećara u Srbiji.',
  inLanguage: 'sr-RS',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://www.zelenisvet.rs/products?title={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Zeleni Svet',
  url: 'https://www.zelenisvet.rs',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.zelenisvet.rs/android-chrome-512x512.png',
    width: 512,
    height: 512
  },
  sameAs: [
    'https://www.instagram.com/zeleni_svet_rs/',
    'https://www.facebook.com/profile.php?id=61577326298021',
    'https://www.tiktok.com/@zelenisvetinfo'
  ]
};

const sitelinksSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Proizvodi',
      description:
        'Istražite našu ponudu cveća, biljaka i baštenskog asortimana.',
      url: 'https://www.zelenisvet.rs/products'
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: 'Usluge',
      description: 'Usluge održavanja i uređenja zelenila i bašta.',
      url: 'https://www.zelenisvet.rs/services'
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: 'Događaji',
      description:
        'Pratite predstojeće događaje iz sveta botanike i cvećarstva.',
      url: 'https://www.zelenisvet.rs/events'
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: 'Blog',
      description: 'Korisni saveti, članci i vesti iz Zelenog Sveta.',
      url: 'https://www.zelenisvet.rs/blog'
    }
  ]
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSchema) }}
      />
      <Home />
    </>
  );
}
