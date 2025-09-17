import { CustomButton, TikTokIcon } from '@green-world/components';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        position: 'relative',
        backgroundColor: theme.palette.secondary.main,
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
      {/* Sekcija sa društvenim mrežama i newsletter */}
      <Box
        component="section"
        sx={(theme) => ({
          maxWidth: 1400,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)'
          },
          gap: '40px',
          [theme.breakpoints.up('md')]: {
            gap: '80px'
          }
        })}
      >
        {/* Društvene mreže + newsletter */}
        <Box>
          <Box sx={{ display: 'flex' }}>
            <IconButton
              component="a"
              href="https://www.instagram.com/zeleni_svet_rs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon sx={{ color: 'white', fontSize: 32 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.linkedin.com/company/zeleni-svet/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon sx={{ color: 'white', fontSize: 32 }} />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.facebook.com/profile.php?id=61577326298021"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon sx={{ color: 'white', fontSize: 32 }} />
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
              component="label"
              htmlFor="email"
              variant="body1"
              sx={{ color: 'white' }}
            >
              Prijavi se da primaš novosti i informacije:
            </Typography>
            <TextField
              type="email"
              name="email"
              id="email"
              placeholder="Unesite email"
              aria-label="Email za prijavu na novosti"
              autoComplete="email"
              size="small"
              sx={{ mt: 1 }}
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
                  sx: { color: 'white' }
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

        {/* Brzi linkovi */}
        <Box component="nav" aria-label="Brzi linkovi" sx={{ color: 'white' }}>
          <Typography variant="body1">Brzi linkovi:</Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5
            }}
          >
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/contact-us')}
              >
                Kontakt
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="a"
                variant="body2"
                href="https://www.instagram.com/zeleni_svet_rs/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecoration: 'underline' }}
              >
                O Nama
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/search')}
              >
                Proizvodi
              </Typography>
            </Box>
            <Box component="li">
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={() => navigate('/login')}
              >
                Prijavi Se
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Korisnička podrška */}
        <Box sx={{ color: 'white' }}>
          <Typography variant="body1">Nudimo korisničku podršku:</Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            {[
              'Kreiranje radnje',
              'Kreiranje oglasa',
              'Kreiranje aktivnosti'
            ].map((text) => (
              <Box
                component="li"
                key={text}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                <Typography component="span" variant="body2">
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Kontakt info / promocija */}
        <Box sx={{ color: 'white' }}>
          <Typography component="h2" variant="h5">
            Želite da istaknete svoj oglas/radnju na početnoj strani?
          </Typography>
          <Typography
            component="a"
            href="mailto:info@zelenisvet.rs"
            sx={{ color: 'inherit', textDecoration: 'underline', mt: 1 }}
          >
            info@zelenisvet.rs
          </Typography>
          <Box
            component="img"
            src="https://res.cloudinary.com/dijofqxeu/image/upload/v1745438146/uqdzbq3113jypz6ercok.png"
            alt="Gardener illustration"
            loading="lazy"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 10,
              height: 180
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
