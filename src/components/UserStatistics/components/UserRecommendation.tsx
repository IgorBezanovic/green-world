import { Box, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';

export const UserRecommendation = () => {
  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 2.5,
        boxShadow: 1
      }}
    >
      <Stack direction="row" spacing={1.5} mb={1}>
        <Sparkles size={20} />
        <Typography fontWeight={600}>
          Kako da povećaš angažovanje korisnika na svom sadržaju?
        </Typography>
      </Stack>

      <Typography fontSize={14} color="text.secondary" mb={2}>
        Aktivnim radom na sadržaju i komunikaciji možete značajno poboljšati
        vidljivost i interakciju sa korisnicima.
      </Typography>

      <Stack spacing={1}>
        <Typography fontSize={14}>
          • Dodajte kvalitetan i redovan sadržaj
        </Typography>
        <Typography fontSize={14}>
          • Delite linkove na društvenim mrežama
        </Typography>
        <Typography fontSize={14}>
          • Koristite jasne i kvalitetne slike proizvoda
        </Typography>
        <Typography fontSize={14}>
          • Brzo odgovarajte na poruke i upite
        </Typography>
        <Typography fontSize={14}>
          • Promovišite najposećenije proizvode
        </Typography>
      </Stack>
    </Box>
  );
};
