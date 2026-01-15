import { GoogleLoginAuth, MetaLoginAuth } from '@green-world/components';
import { RegistrationValues } from '@green-world/utils/types';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  InputAdornment,
  IconButton,
  Button,
  Divider,
  Typography,
  CircularProgress,
  OutlinedInput
} from '@mui/material';
import { useState } from 'react';

export const RegistrationForm = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [registrationData, setRegistrationData] = useState<RegistrationValues>({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.mutate(registrationData);
  };

  const hasError = Boolean(props.error?.response?.data);

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
        maxWidth: 540,
        width: '100%',
        mx: 'auto'
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          mx: 'auto',
          mb: 2
        }}
      >
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          <strong>Registrujte se brzo, lako i jednostavno!</strong>
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Nakon registracije idite na svoj profil i popunite svoje dodatne
          podatke.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Na taj način će drugi korisnici lakše kotaktirati sa Vama.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <OutlinedInput
          required
          id="mail"
          name="email"
          type="email"
          placeholder="Unesite e-mail"
          value={registrationData.email}
          onChange={(e) =>
            setRegistrationData({ ...registrationData, email: e.target.value })
          }
          disabled={props.isLoading}
          error={hasError}
          fullWidth
          startAdornment={
            <InputAdornment position="start">
              <MailOutlineIcon />
            </InputAdornment>
          }
          sx={{
            bgcolor: 'background.default',
            '& .MuiOutlinedInput-input': { p: '12px' }
          }}
        />

        <OutlinedInput
          required
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Unesite password"
          value={registrationData.password}
          onChange={(e) =>
            setRegistrationData({
              ...registrationData,
              password: e.target.value
            })
          }
          disabled={props.isLoading}
          error={hasError}
          fullWidth
          sx={{
            bgcolor: 'background.default',
            '& .MuiOutlinedInput-input': { p: '12px' }
          }}
          startAdornment={
            <InputAdornment position="start">
              <LockOutlinedIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword((s) => !s)}
                edge="end"
                size="large"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={props.isLoading}
          sx={{ mt: 2 }}
          fullWidth
        >
          {props.isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Registruj se'
          )}
        </Button>

        {props.error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {props.error?.response?.data}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <GoogleLoginAuth />
      </Box>
      <Box sx={{ mt: 2 }}>
        <MetaLoginAuth />
      </Box>
    </Box>
  );
};
