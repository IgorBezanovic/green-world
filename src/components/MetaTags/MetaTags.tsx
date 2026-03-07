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
  const finalDescription = description ?? t('metaTags.defaultDescription');
  const finalKeywords = keywords ?? t('metaTags.defaultKeywords');
  const url = window.location.href;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta property="og:title" content={`Zeleni svet | ${title}`} />
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
              name: `Zeleni svet | ${title}`,
              description: finalDescription,
              url,
              image,
              publisher: {
                '@type': 'Organization',
                name: 'Zeleni svet',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://media.licdn.com/dms/image/v2/D4D0BAQFVzgxtJMN08g/company-logo_100_100/B4DZlcK5XVH0AQ-/0/1758187984852/zeleni_svet_logo?e=1762387200&v=beta&t=eAPy1aq48-Bs1CJrgA84bAnPLrBmlr0iXTRzASHn22M'
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
