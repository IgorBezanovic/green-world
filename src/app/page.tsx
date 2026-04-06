/**
 * Root fallback for the default locale (sr) in Turbopack dev mode.
 * In production, next-intl middleware transparently rewrites "/" → "/sr"
 * internally, so this page is never reached and the URL always stays "/".
 * In Turbopack dev, the middleware rewrite for the root path is skipped,
 * so this server component renders the sr home page directly at "/" without
 * any URL change, keeping behaviour consistent with all other sr pages.
 */
import { Layout } from '@green-world/components/Layout/Layout';
import { Home } from '@green-world/views/Home';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Providers } from './providers';

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

export default async function RootPage() {
  setRequestLocale('sr');
  const messages = await getMessages();

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
      <NextIntlClientProvider locale="sr" messages={messages}>
        <Providers>
          <Layout>
            <Home />
          </Layout>
        </Providers>
      </NextIntlClientProvider>
    </>
  );
}
