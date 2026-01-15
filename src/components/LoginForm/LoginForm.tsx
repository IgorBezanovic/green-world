import {
  Divider,
  GoogleLoginAuth,
  MetaLoginAuth
} from '@green-world/components';
import { AuthValues } from '@green-world/utils/types';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router';

export const LoginForm = ({ ...props }) => {
  const [auth, setAuth] = useState<AuthValues>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.mutate(auth);
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
        maxWidth: 540,
        width: '100%',
        mx: 'auto',
        mb: 4
      })}
    >
      {props.isUserLogged === 'false' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            mx: 'auto',
            mb: 2
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>
              Treba da se ulogujete ukoliko želite da postavite oglas.
            </strong>
          </Typography>
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
          <Typography
            htmlFor="email"
            component="label"
            sx={{ mb: 0.5, color: 'text.primary', cursor: 'pointer' }}
          >
            Email:
          </Typography>

          <OutlinedInput
            id="email"
            name="email"
            type="email"
            value={auth.email}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
            disabled={props.isLoading}
            error={Boolean(props.error?.response?.data)}
            placeholder="Unesite email"
            required
            sx={{
              bgcolor: 'background.default',
              '& .MuiOutlinedInput-input': { p: '12px' }
            }}
          />
        </Box>

        <Box sx={{ flexDirection: 'column', display: 'flex' }}>
          <Typography
            htmlFor="password"
            component="label"
            sx={{ mt: 1, mb: 0.5, color: 'text.primary', cursor: 'pointer' }}
          >
            Lozinka:
          </Typography>

          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
            disabled={props.isLoading}
            error={Boolean(props.error?.response?.data)}
            placeholder="Unesite lozinku"
            required
            sx={{
              bgcolor: 'background.default',
              '& .MuiOutlinedInput-input': { p: '12px' }
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {props.isLoading ? (
            <Typography variant="body2" sx={{ color: 'text.disabled', mt: 1 }}>
              Zaboravljena lozinka?
            </Typography>
          ) : (
            <Box
              component={Link}
              to="/forgot-password"
              sx={{ color: 'primary.main', textDecoration: 'none', mt: 1 }}
            >
              <Typography variant="body2" color="text.primary">
                Zaboravljena lozinka?
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 3
          }}
        >
          {props.isLoading ? (
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Nemate nalog? Registrujte se
            </Typography>
          ) : (
            <Box
              component={Link}
              to="/registration"
              sx={{ color: 'primary.main', textDecoration: 'none' }}
            >
              <Typography variant="body2" color="text.primary">
                Nemate nalog? Registrujte se
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 1, width: '100%' }}
            disabled={props.isLoading}
          >
            {props.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Prijavi se'
            )}
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: -2
          }}
        >
          <Divider />
          <GoogleLoginAuth />
          <MetaLoginAuth />
          <Typography variant="caption" align="center" sx={{ mt: -1 }}>
            Prijavom prihvatate našu{' '}
            <Box
              component={Link}
              to="/privacy-policy"
              sx={{ textDecoration: 'underline', display: 'inline' }}
            >
              Politiku privatnosti
            </Box>
            .
          </Typography>
        </Box>

        {props.error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {props.error?.response?.data}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
