import clsx from 'clsx';

export const UnderConstruction = () => {
  return (
    <>
      <title>Zeleni svet | U izradi</title>
      <meta
        name="description"
        content="Stranica je trenutno u izradi. Radimo na poboljšanju korisničkog iskustva. Ostanite sa nama!"
      />
      <meta
        name="keywords"
        content="zeleni svet, biljke, webshop, bašta, u izradi"
      />
      <meta property="og:title" content="Zeleni svet | U izradi" />
      <meta
        property="og:description"
        content="Stranica je trenutno u izradi. Radimo na poboljšanju korisničkog iskustva."
      />
      <meta
        property="og:image"
        content="https://www.zelenisvet.rs/background_login.jpeg"
      />
      <meta property="og:url" content="https://www.zelenisvet.rs/u-izradi" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="canonical" href="https://www.zelenisvet.rs/u-izradi" />

      {/* ✅ Structured data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Zeleni svet | U izradi',
            description:
              'Stranica je trenutno u izradi. Radimo na poboljšanju korisničkog iskustva.',
            url: 'https://www.zelenisvet.rs/u-izradi',
            image: 'https://www.zelenisvet.rs/background_login.jpeg',
            publisher: {
              '@type': 'Organization',
              name: 'Zeleni svet',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.svgrepo.com/show/426192/cogs-settings.svg'
              }
            }
          },
          null,
          2
        )}
      </script>

      <div
        className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}
        style={{
          backgroundImage: "url('/background_login.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-gray-100">
          <div className="min-h-screen flex flex-col justify-center items-center">
            <img
              src="https://www.svgrepo.com/show/426192/cogs-settings.svg"
              alt="Logo"
              className="mb-8 h-40"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 mb-4">
              Stranica je trenutno u izradi
            </h1>
            <p className="text-center text-gray-500 text-lg md:text-xl lg:text-2xl mb-8">
              Naporno radimo na poboljšanju korisničkog iskustva. Ostanite sa
              nama!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
