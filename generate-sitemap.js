import { writeFileSync } from 'fs';
import fetch from 'node-fetch';
import { SitemapStream, streamToPromise } from 'sitemap';

async function generateSitemap() {
  const hostname = 'https://green-world-be-prod.onrender.com';
  const smStream = new SitemapStream({ hostname: 'https://zelenisvet.rs' });

  const staticPages = [
    {
      url: '/',
      changefreq: 'daily',
      priority: 1.0,
      title: 'Zeleni svet | Početna',
      description:
        'Dobrodošli na Zeleni svet – vaša platforma za povezivanje sa lokalnim poljoprivrednim proizvodima, događajima i ekološkim aktivnostima.'
    },
    {
      url: '/login',
      changefreq: 'monthly',
      priority: 0.8,
      title: 'Prijava | Zeleni svet',
      description:
        'Prijavite se na svoj Zeleni svet nalog da biste pratili događaje, kupovali proizvode i povezivali se sa zajednicom.'
    },
    {
      url: '/registration',
      changefreq: 'monthly',
      priority: 0.8,
      title: 'Registracija | Zeleni svet',
      description:
        'Kreirajte svoj Zeleni svet nalog i pridružite se zajednici korisnika zainteresovanih za ekološke aktivnosti i lokalne proizvode.'
    },
    {
      url: '/forgot-password',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Zaboravljena lozinka | Zeleni svet',
      description:
        'Resetujte svoju lozinku i povratite pristup svom Zeleni svet nalogu brzo i sigurno.'
    },
    {
      url: '/profile',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Moj profil | Zeleni svet',
      description:
        'Pratite svoje aktivnosti, spremljene proizvode i događaje na Zeleni svet platformi.'
    },
    {
      url: '/profile-settings/edit-profile',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Izmena profila | Zeleni svet',
      description:
        'Ažurirajte informacije o svom profilu i personalizujte svoj Zeleni svet nalog.'
    },
    {
      url: '/profile-settings/change-image',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Promena profilne slike | Zeleni svet',
      description:
        'Postavite ili promenite profilnu sliku svog Zeleni svet naloga.'
    },
    {
      url: '/profile-settings/change-password',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Promena lozinke | Zeleni svet',
      description: 'Sigurno promenite lozinku svog Zeleni svet naloga.'
    },
    {
      url: '/search',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Pretraga proizvoda | Zeleni svet',
      description:
        'Pretražujte proizvode, događaje i korisnike na Zeleni svet platformi.'
    },
    {
      url: '/events',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Događaji | Zeleni svet',
      description:
        'Pronađite lokalne ekološke aktivnosti, sadnju biljaka, čišćenje lokacija i podršku malim poljoprivrednim proizvođačima.'
    },
    {
      url: '/contact-us',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Kontaktirajte nas | Zeleni svet',
      description:
        'Stupite u kontakt sa Zeleni svet timom za podršku, pitanja i sugestije.'
    },
    {
      url: '/create-product',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Dodaj proizvod | Zeleni svet',
      description:
        'Objavite svoj proizvod i povežite se sa kupcima na Zeleni svet platformi.'
    },
    {
      url: '/create-event',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Dodaj događaj | Zeleni svet',
      description:
        'Organizujete događaj? Dodajte ga na Zeleni svet i povežite se sa zainteresovanim korisnicima.'
    },
    {
      url: '/privacy-policy',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Politika privatnosti | Zeleni svet',
      description:
        'Pročitajte našu politiku privatnosti i saznajte kako štitimo vaše podatke.'
    },
    {
      url: '/search/flower_assortment',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Cvetni asortiman | Zeleni svet',
      description:
        'Pronađite i kupite raznovrsno cveće kroz Zeleni svet platformu.'
    },
    {
      url: '/search/succulents',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Sukulenti | Zeleni svet',
      description:
        'Otkrijte širok izbor sukulenata za dom, baštu i kancelariju.'
    },
    {
      url: '/search/potted_flowers',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Saksijsko cveće | Zeleni svet',
      description:
        'Izaberite dugotrajno cveće u saksijama za ukrašavanje prostora.'
    },
    {
      url: '/search/seedlings',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Sadnice | Zeleni svet',
      description: 'Pronađite mlade biljne izdanke za sadnju u bašti ili vrtu.'
    },
    {
      url: '/search/fruits_and_vegetables',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Voće i povrće | Zeleni svet',
      description:
        'Kupujte sveže voće i povrće direktno od lokalnih proizvođača.'
    },
    {
      url: '/search/herbal_pharmacy',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Biljna apoteka | Zeleni svet',
      description: 'Lekovi, preparati, dohrana i zaštita za sve vrste biljaka.'
    },
    {
      url: '/search/garden_decoration',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Baštenska dekoracija | Zeleni svet',
      description: 'Pronađite dekorativne elemente za uređenje bašte i vrta.'
    },
    {
      url: '/search/everything_for_plants',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Sve za biljke | Zeleni svet',
      description:
        'Sve što vam treba za negu, održavanje i uživanje u biljkama.'
    },
    {
      url: '/admin/google-analytics',
      changefreq: 'daily',
      priority: 0.9,
      title: 'Google Analytics | Zeleni svet',
      description:
        'Administrativni panel za praćenje statistike i analitiku sa Google Analytics.'
    }
  ];

  // statične stranice
  staticPages.forEach((page) => smStream.write(page));

  // API proizvoda
  const resProduct = await fetch(`${hostname}/api/product/all`);
  const products = await resProduct.json();
  products.products.forEach((p) =>
    smStream.write({
      url: `/product/${p._id}`,
      image: p.images[0],
      changefreq: 'daily',
      priority: 1,
      title: p.title || '',
      description: p.description || '',
      price: p.price || '',
      shopName: p.shopName || '',
      name: p.name || '',
      phone: p.phone || '',
      email: p.email || ''
    })
  );

  // API dogadjaja
  const resEvent = await fetch(`${hostname}/api/action/all`);
  const event = await resEvent.json();
  event.forEach((e) =>
    smStream.write({
      url: `/event/${e._id}`,
      changefreq: 'daily',
      priority: 1,
      image: e.coverImage,
      title: e.title || '',
      description: e.description || '',
      typeAction: e.typeAction || '',
      dateAction: e.dateAction || '',
      startTime: e.startTime || '',
      place: e.place || '',
      address: e.address || '',
      contactPerson: e.contactPerson || '',
      contactMail: e.contactMail || ''
    })
  );

  smStream.end();

  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());
  writeFileSync('./public/sitemap.xml', sitemap);

  console.log('✅ Sitemap generisan!');
}

generateSitemap().catch(console.error);
