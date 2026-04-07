'use client';

import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface PageSEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const MetaTags = ({
  title = 'Green World',
  description,
  keywords,
  image = 'https://www.zelenisvet.rs/green-world.svg'
}: PageSEOProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const url = `https://www.zelenisvet.rs${pathname ?? ''}`;
  const finalDescription = description ?? t('metaTags.defaultDescription');
  const finalKeywords = keywords ?? t('metaTags.defaultKeywords');

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Zeleni Svet" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: title,
              description: finalDescription,
              url,
              image,
              publisher: {
                '@type': 'Organization',
                name: 'Zeleni svet',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.zelenisvet.rs/android-chrome-512x512.png',
                  width: 512,
                  height: 512
                }
              }
            },
            null,
            2
          )
        }}
      />
    </>
  );
};
