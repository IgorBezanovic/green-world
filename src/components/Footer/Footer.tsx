import { CustomButton, Logo, TikTokIcon } from '@green-world/components';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { useState } from 'react';

export const Footer = () => {
  const [userEmail, setUserEmail] = useState<string>('');

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: 'relative',
        backgroundColor: theme.palette.custom.forestGreen,
        paddingX: '16px',
        paddingY: '40px',
        shadow: theme.shadows[1],
        [theme.breakpoints.down('xl')]: {
          px: 4
        },
        [theme.breakpoints.down('sm')]: {
          px: 3
        },
        [theme.breakpoints.down('xs')]: {
          px: 2
        }
      })}
    >
      <Box
        component="section"
        sx={(theme) => ({
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '40px',
          [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          [theme.breakpoints.up('lg')]: {
            gridTemplateColumns: 'repeat(4, 1fr)'
          },
          [theme.breakpoints.up('md')]: {
            gap: '80px'
          }
        })}
      >
        <Box>
          <Box sx={{ display: 'flex' }}>
            <IconButton
              component="a"
              href="https://www.instagram.com/zeleni_svet_rs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon sx={{ color: 'white', fontSize: '32px' }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/company/zeleni-svet/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon sx={{ color: 'white', fontSize: '32px' }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.facebook.com/profile.php?id=61577326298021"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon sx={{ color: 'white', fontSize: '32px' }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.tiktok.com/@zelenisvetinfo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </IconButton>
          </Box>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}
          >
            <Typography
              variant="body1"
              component="label"
              htmlFor="email"
              color="white"
            >
              Prijavi se da primaš novosti i informacije:
            </Typography>
            <TextField
              type="text"
              name="email"
              id="email"
              placeholder="Unesite email"
              autoComplete="true"
              size="small"
              sx={{
                mt: 1
              }}
              slotProps={{
                input: {
                  sx: {
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    }
                  }
                },
                inputLabel: {
                  sx: {
                    color: 'white'
                  }
                }
              }}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <CustomButton
              type="text"
              customStyle={['bg-whiteLinen', 'mt-4', 'min-h-[22px]']}
              onClick={() => setUserEmail('')}
              text="Prijavi se"
            />
          </Box>
        </Box>

        <Box sx={{ color: 'white' }}>
          <Typography variant="body1">Kontaktirajte nas:</Typography>
          <Typography
            component="a"
            href="mailto:info@zelenisvet.rs"
            sx={{ color: 'inherit' }}
          >
            info@zelenisvet.rs
          </Typography>
          <Logo width="100px" height="100px" sx={{ marginTop: '16px' }} />
        </Box>

        <Box sx={{ color: 'white' }}>
          <Typography variant="body1">Nudimo korisničku podršku:</Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            <Box
              component="li"
              sx={{ display: 'flex', alignItems: 'center', mb: '8px' }}
            >
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                Kreiranje radnje
              </Typography>
            </Box>
            <Box
              component="li"
              sx={{ display: 'flex', alignItems: 'center', mb: '8px' }}
            >
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                Kreiranje oglasa
              </Typography>
            </Box>
            <Box component="li" sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />
              <Typography component="span" variant="body2">
                Kreiranje aktivnosti
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ color: 'white' }}>
          <Typography variant="h5">
            Zelite da istaknete svoj oglas/radnju na pocetnoj strani?
          </Typography>
          <Typography
            component="a"
            href="mailto:info@zelenisvet.rs"
            sx={{ color: 'inherit' }}
          >
            info@zelenisvet.rs
          </Typography>
          <img
            src="https://res.cloudinary.com/dijofqxeu/image/upload/v1745438146/uqdzbq3113jypz6ercok.png"
            alt="gardener"
            className="absolute bottom-0 right-10 h-[180px]"
          />
        </Box>
      </Box>
    </Box>
  );
};
