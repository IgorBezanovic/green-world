import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { Box, Divider, Typography, Button } from '@mui/material';
import { Heart, ShieldCheck, Trash2, Users, Info } from 'lucide-react';
import { useState } from 'react';

import { DonatePayPalDialog } from './DonatePayPalDialog';

export const Documents = () => {
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Dokumenta', route: '/documents' }
  ];

  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title="Dokumenta | Zeleni svet"
        description="Politika privatnosti, donacije, vizija i misija, brisanje naloga i uslovi korišćenja platforme Zeleni svet."
      />
      <Box
        sx={(theme) => ({
          maxWidth: '1000px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '2rem',
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Users /> Naša vizija i misija
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Naša misija je da povežemo ljude koji proizvode, sade i neguju
            biljke sa onima koji ih vole i žele da ulepšaju svoj prostor
            prirodom.
            <br />
            Vizija Zelenog sveta je da postane centralno mesto okupljanja
            ljubitelja prirode, baštovanstva i održivog načina života.
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <ShieldCheck /> Politika privatnosti
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Zeleni svet poštuje privatnost svojih korisnika. Lični podaci
            prikupljaju se samo u meri neophodnoj za korišćenje platforme.
            <br />
            Svi podaci se čuvaju na siguran način i ne dele se sa trećim licima
            osim u slučajevima zakonske obaveze.
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Heart /> Donacije
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Donacije su dobrodošle i pomažu nam da održavamo platformu
            besplatnom za sve korisnike.
            <br />
            Ukoliko želiš da podržiš razvoj Zelenog Sveta, možeš to učiniti
            uplatom simbolične donacije.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ position: 'relative' }}
            // onClick={() => setDonateOpen(true)}
          >
            Doniraj - USKORO
          </Button>

          <DonatePayPalDialog
            open={donateOpen}
            onClose={() => setDonateOpen(false)}
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Trash2 /> Brisanje naloga
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Ukoliko želiš da obrišeš svoj nalog i sve podatke sa platforme,
            pošalji zahtev putem e-mail adrese{' '}
            <strong>info@zelenisvet.rs</strong>.
            <br />
            Nakon potvrde identiteta, svi tvoji podaci i objavljeni proizvodi
            biće trajno uklonjeni u roku od 48 sati.
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Info /> Odricanje od odgovornosti
          </Typography>
          <Typography variant="body1">
            Zeleni svet ne prodaje proizvode objavljene na platformi. Mi
            omogućavamo kontakt između kupaca i prodavaca — naši korisnici sami
            objavljuju, uređuju i odgovaraju za svoje ponude.
            <br />
            Ipak, u slučaju problema ili spora, naš tim može preuzeti
            komunikaciju između strana i pomoći u rešavanju nesporazuma.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
