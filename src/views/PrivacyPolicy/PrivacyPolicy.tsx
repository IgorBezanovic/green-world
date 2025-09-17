import { Box, Typography, Container } from '@mui/material';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const PrivacyPolicy = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Politika privatnosti</title>
        <link
          rel="canonical"
          href={`https://www.zelenisvet.rs/privacy-policy`}
        />
      </Helmet>

      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h3" gutterBottom>
            Politika privatnosti
          </Typography>

          <Typography variant="body1">
            Ova politika privatnosti objašnjava kako prikupljamo, koristimo i
            štitimo vaše lične podatke kada koristite našu web platformu.
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Koje podatke prikupljamo
            </Typography>
            <Typography variant="body1">
              Kada se prijavite putem Google ili Facebook-a, prikupljamo osnovne
              osnovne javne podatke iz vašeg profila, uključujući vaše ime i
              prezime, email adresu i profilnu sliku.
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Kako koristimo vaše podatke
            </Typography>
            <Typography variant="body1">
              Vaše podatke koristimo isključivo za kreiranje korisničkog profila
              i poboljšanje vašeg iskustva na našoj platformi. Ne delimo i ne
              prodajemo vaše podatke trećim licima.
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              O našoj platformi
            </Typography>
            <Typography variant="body1">
              Naša platforma omogućava lokalnim prodavnicama i malim biznisima
              da oglase svoje proizvode. Mi sami ne prodajemo proizvode niti
              naplaćujemo bilo kakve naknade. Naš cilj je da spojimo kupce sa
              prodavcima na jednom mestu.
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Brisanje podataka i kontakt
            </Typography>
            <Typography variant="body1">
              Ukoliko želite da obrišemo vaš nalog ili vaše podatke, možete nas
              kontaktirati na <strong>info@zelenisvet.rs</strong>.
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="body2">
              Poslednje ažuriranje: 28. jul 2025.
            </Typography>
          </Box>
        </Container>
      </div>
    </div>
  );
};
