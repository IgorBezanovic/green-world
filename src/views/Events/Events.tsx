import {
  AppBreadcrumbs,
  EventCarousel,
  MetaTags
} from '@green-world/components';
import { useAllEvents } from '@green-world/hooks/useAllEvents';
import { Box, Typography } from '@mui/material';
import clsx from 'clsx';

export const Events = () => {
  const { data: allEvents, isLoading: allEventsLoading } = useAllEvents();
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Događaji', route: '/events' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni svet | Pretraga Događaja '} />
      <Box
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
        <AppBreadcrumbs pages={pages} />
        <Typography
          variant="h2"
          sx={(theme) => ({
            fontSize: '3.75rem !important',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem !important'
            },
            color: 'secondary.main',
            fontFamily: 'Ephesis',
            marginX: 'auto'
          })}
        >
          Događaji
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            maxWidth: '900px',
            marginX: 'auto'
          }}
        >
          U okviru aktivnosti koje naši korisnici mogu pratiti i učestvovati,
          Zeleni svet omogućava povezivanje sa događajima koji spajaju
          zajednicu, prirodu i lokalne proizvođače. Naša aplikacija služi kao
          most između organizatora i zainteresovanih učesnika, pružajući jasne
          informacije o lokaciji, vremenu i tipu događaja, kako bi svako mogao
          da planira svoje učešće.
        </Typography>
        <EventCarousel events={allEvents} isLoading={allEventsLoading} />

        <Typography variant="body1" sx={{ mt: 4 }}>
          <strong>Čišćenje lokacija</strong> – naši korisnici mogu da se
          priključe akcijama čišćenja parkova, šuma i drugih javnih prostora
          koje organizuju lokalni timovi ili udruženja. Aktivnosti ne samo da
          doprinose očuvanju prirode, već i okupljaju zajednicu, podstičući
          osećaj odgovornosti i solidarnosti. Lokacija i datum svake akcije
          jasno su istaknuti kroz našu platformu, kako bi svi mogli da se
          uključe na vreme.
          <br />
          <br />
          <strong>Sadnja biljaka i pošumljavanje</strong> – preko naše
          aplikacije, korisnici mogu da pronađu događaje sadnje drveća, cvetnih
          aleja i zelenih površina. Ove akcije imaju višestruki značaj:
          poboljšavaju kvalitet vazduha, obogaćuju biodiverzitet i stvaraju
          dugoročnu vrednost za lokalnu zajednicu. Svaka lokacija i vreme
          događaja su unapred objavljeni, olakšavajući korisnicima da se
          organizuju i učestvuju u aktivnostima koje im najviše odgovaraju.
          <br />
          <br />
          <strong>Podrška malim poljoprivrednim gazdinstvima</strong> – naši
          korisnici mogu pratiti i zakazane prodaje lokalnih proizvođača malina,
          kupina i drugih proizvoda. Aplikacija im omogućava da saznaju gde i
          kada će se održati prodaja, pružajući direktan pristup svežim i
          kvalitetnim proizvodima. Ovo takođe pomaže malim proizvođačima da dođu
          do svojih kupaca i predstave svoj rad široj publici.
          <br />
          <br />
          Svaka od ovih aktivnosti predstavlja priliku za učenje, druženje i
          stvaranje pozitivnog uticaja na zajednicu i prirodu. Naša platforma
          olakšava povezivanje korisnika sa događajima koji imaju stvaran
          značaj, jer svaki doprinos, ma koliko mali, čini naš svet zelenijim i
          lepšim.
        </Typography>
      </Box>
    </Box>
  );
};
