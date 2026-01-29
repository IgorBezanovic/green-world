import { useChangePassword } from '@green-world/hooks/useChangePassword';
import { NewPasswordValues } from '@green-world/utils/types';
import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';

export const ChangePasswordComponent = () => {
  const { mutate, error, isPending } = useChangePassword();

  const [passwordCollection, setPasswordCollection] =
    useState<NewPasswordValues>({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });

  const passwordsMismatch =
    passwordCollection.newPassword !== passwordCollection.confirmNewPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordCollection((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(passwordCollection);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 700, mx: 'auto' }}
    >
      <title>Zeleni svet | Promena lozinke</title>
      <link
        rel="canonical"
        href="https://www.zelenisvet.rs/profile-settings/change-password"
      />

      {/* Stara lozinka */}
      <Box
        component="label"
        htmlFor="currentPassword"
        sx={{
          display: 'flex',
          color: 'secondary.main',
          cursor: 'pointer',
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          fontWeight: 200,
          mb: 1
        }}
      >
        Unesite stari password:
      </Box>

      <TextField
        fullWidth
        required
        type="password"
        placeholder="Stara lozinka"
        name="currentPassword"
        id="currentPassword"
        disabled={isPending}
        onChange={handleChange}
      />

      {/* Nova lozinka */}
      <Box
        component="label"
        htmlFor="newPassword"
        sx={{
          display: 'flex',
          color: 'secondary.main',
          cursor: 'pointer',
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          fontWeight: 200,
          mt: 4,
          mb: 1
        }}
      >
        Unesite novi password:
      </Box>

      <TextField
        fullWidth
        required
        type="password"
        placeholder="Nova lozinka"
        name="newPassword"
        id="newPassword"
        disabled={isPending}
        onChange={handleChange}
      />

      {/* Potvrda lozinke */}
      <Box
        component="label"
        htmlFor="confirmNewPassword"
        sx={{
          display: 'flex',
          color: 'secondary.main',
          cursor: 'pointer',
          fontSize: '1.125rem',
          lineHeight: '1.75rem',
          fontWeight: 200,
          mt: 4,
          mb: 1
        }}
      >
        Ponovite novi password:
      </Box>

      {passwordsMismatch && (
        <Alert
          severity="warning"
          sx={{
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          Lozinke se ne poklapaju
        </Alert>
      )}

      <TextField
        fullWidth
        required
        type="password"
        placeholder="Ponovite novu lozinku"
        name="confirmNewPassword"
        id="confirmNewPassword"
        disabled={isPending}
        onChange={handleChange}
        error={passwordsMismatch}
      />

      {/* Submit */}
      <Button
        variant="outlined"
        type="submit"
        disabled={isPending || passwordsMismatch}
        sx={{
          mt: 4,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {isPending ? <CircularProgress size={20} /> : 'Promeni password'}
      </Button>

      {/* Error */}
      {error && (
        <Box
          sx={{
            mt: 2,
            color: 'error.main',
            fontWeight: 500
          }}
        >
          {(error as any)?.response?.data}
        </Box>
      )}
    </Box>
  );
};
