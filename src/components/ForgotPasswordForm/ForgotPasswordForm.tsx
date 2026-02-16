import { useForgotPassword } from '@green-world/hooks/useForgotPassword';
import {
  Box,
  OutlinedInput,
  InputAdornment,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { Mail } from 'lucide-react';
import { useState } from 'react';

export const ForgotPasswordForm = () => {
  const { mutate, error, isPending } = useForgotPassword();
  const [email, setEmail] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(email);
  };

  return (
    <Box
      component="section"
      sx={(theme) => ({
        bgcolor: 'background.main',
        boxShadow: 3,
        borderRadius: 1,
        p: 5,
        [theme.breakpoints.down('md')]: {
          p: 3
        },
        maxWidth: 768,
        width: '100%',
        mx: 'auto',
        mt: 6
      })}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant="h5" sx={{ mb: 0 }}>
          Ukoliko ste zaboravili svoju lozinku, nije problem.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Na Vašu e-mail adresu biće poslata privremena lozinka. Nakon prijave,
          molimo Vas da odmah promenite lozinku u okviru Vašeg profila.
        </Typography>

        <OutlinedInput
          required
          type="email"
          name="email"
          id="e-mail"
          placeholder="Unesite email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          disabled={isPending}
          startAdornment={
            <InputAdornment position="start">
              <Mail />
            </InputAdornment>
          }
          sx={{
            bgcolor: 'background.default',
            '& .MuiOutlinedInput-input': { p: '12px' }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          sx={{ mt: 3, maxWidth: 500, alignSelf: 'center' }}
        >
          {isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Promeni lozinku'
          )}
        </Button>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {(error as any)?.response?.data}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
