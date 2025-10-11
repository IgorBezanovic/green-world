interface PageSEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export const MetaTags = ({
  title = 'Green World',
  description = 'Besplatna web platforma za oglašavanje proizvoda iz oblasti cvećarstva, baštovanstva, biljnih dekoracija i poljoprivrednih apoteka. Gradimo zajednicu ljubitelja biljaka i prirode.',
  keywords = 'kupovina cveca, kupovina tuje, tuje srbija, cvece, biljke, saksije, zeleno, svet, buketi cveca, oprema za baštovanstvo, baštenski alati, biljke, semena, dodaci za baštovanstvo, zeleni proizvodi, ekološko baštovanstvo, baštenski materijal, biljke za spolja, biljke za unutra, nega travnjaka, nega biljaka, održivo baštovanstvo, dekoracija bašte | gardening equipment, garden tools, plants, seeds, gardening accessories, green products, eco-friendly gardening, garden supplies, outdoor plants, indoor plants, lawn care, plant care, sustainable gardening, garden decor',
  image = 'https://www.zelenisvet.rs/green-world.svg'
}: PageSEOProps) => {
  const url = window.location.href;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={`Zeleni svet | ${title}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
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
              description,
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
