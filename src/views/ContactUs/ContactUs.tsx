import { MetaTags } from '@green-world/components';
import { useContactUs } from '@green-world/hooks/useContactUs';
import { ContactUsValues } from '@green-world/utils/types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material';
import { ReactNode, useState } from 'react';

export const ContactUs = () => {
  const { mutate, error, isPending } = useContactUs();

  const [contactForm, setContactForm] = useState<ContactUsValues>({
    subject: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(contactForm, {
      onSuccess: () => setContactForm({ subject: '', email: '', message: '' })
    });
  };

  return (
    <Box sx={{ bgcolor: '#F7F9F4' }}>
      <MetaTags title="Zeleni svet | Kontaktirajte nas" />

      {/* HERO */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.info.main,
          color: theme.palette.common.white,
          py: 6,
          px: 2
        })}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '3rem'
            }}
          >
            Kontaktirajte nas
          </Typography>

          <Typography sx={{ maxWidth: 520, mt: 2, opacity: 0.9 }}>
            Vaše mišljenje nam je važno. Bilo da imate pitanje, sugestiju ili
            želite saradnju – tu smo za vas.
          </Typography>
        </Box>
      </Box>

      {/* CONTENT */}
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: 2,
          py: 6,
          columns: 2,
          [theme.breakpoints.down('md')]: {
            columns: 1
          },
          gap: 3
        })}
      >
        {/* LEFT – FORM */}
        <Card>
          <CardContent>
            <Typography fontWeight={600} mb={3}>
              Pišite nam
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Tema poruke"
                name="subject"
                required
                value={contactForm.subject}
                onChange={handleChange}
              />

              <TextField
                label="E-mail ili telefon"
                name="email"
                required
                value={contactForm.email}
                onChange={handleChange}
              />

              <TextField
                label="Vaša poruka"
                name="message"
                required
                multiline
                rows={5}
                value={contactForm.message}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isPending}
                sx={{
                  mt: 2,
                  py: 1.4,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Pošalji poruku
              </Button>

              {(error as ReactNode) && (
                <Typography color="error">
                  Došlo je do greške. Pokušajte ponovo.
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* RIGHT – INFO */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Zašto je komunikacija bitna?
              </Typography>

              {[
                'Bolje razumijevanje vaših potreba',
                'Stalno poboljšanje usluga',
                'Izgradnja povjerenja'
              ].map((text) => (
                <Box
                  key={text}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <CheckCircleOutlineIcon color="success" fontSize="small" />
                  <Typography variant="body2">{text}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Kontakt informacije
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <EmailOutlinedIcon fontSize="small" />
                <Typography variant="body2">info@zelenisvet.rs</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <PhoneOutlinedIcon fontSize="small" />
                <Typography variant="body2">+381 60 000 0000</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <LocationOnOutlinedIcon fontSize="small" />
                <Typography variant="body2">Beograd, Srbija</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography fontWeight={600} mb={2}>
                Radno vrijeme podrške
              </Typography>

              <Typography variant="body2">
                Ponedeljak – Petak: 09:00 – 17:00
              </Typography>
              <Typography variant="body2">Subota: 10:00 – 14:00</Typography>
              <Typography variant="body2" color="text.secondary">
                Nedelja: Zatvoreno
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
