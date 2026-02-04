import { MetaTags } from '@green-world/components';
import { useContactUs } from '@green-world/hooks/useContactUs';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import {
  ChevronDown,
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { useState } from 'react';

export const ContactUs = () => {
  const { mutate, isPending } = useContactUs();

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    subject: '',
    email: '',
    message: ''
  });

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullMessage = `
Ime: ${contactForm.name}
Telefon: ${contactForm.phone}

Poruka:
${contactForm.message}`;

    mutate(
      { ...contactForm, message: fullMessage },
      {
        onSuccess: () =>
          setContactForm({
            name: '',
            phone: '',
            subject: '',
            email: '',
            message: ''
          })
      }
    );
  };

  const isFormValid = Boolean(
    contactForm.email.trim() &&
      contactForm.subject.trim() &&
      contactForm.message.trim()
  );

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
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

      {/* FEATURES */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 4,
            flexWrap: 'wrap'
          }}
        >
          {/* Feature 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'success.light',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">Brz odgovor</Typography>
              <Typography variant="body1" color="text.secondary">
                Odgovaramo u roku od 24 sata
              </Typography>
            </Box>
          </Box>

          {/* Feature 2 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'warning.light',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">Sigurna komunikacija</Typography>
              <Typography variant="body1" color="text.secondary">
                Vaši podaci su zaštićeni
              </Typography>
            </Box>
          </Box>

          {/* Feature 3 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'success.light',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">Stručna podrška</Typography>
              <Typography variant="body1" color="text.secondary">
                Naš tim je tu za vas
              </Typography>
            </Box>
          </Box>
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
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 3,
          alignItems: 'start',
          [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr'
          }
        })}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'success.light',
              width: 'fit-content',
              px: 2,
              py: 0.5,
              borderRadius: 10,
              mb: 2
            }}
          >
            <MessageCircle />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              Pošaljite poruku
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '2.5rem'
            }}
          >
            Pišite nam
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            Ispunite formu ispod i kontaktiraćemo Vas u najkraćem mogućem roku.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
                mb: 3
              }}
            >
              <Box>
                <Typography variant="body1" mb={1}>
                  Ime i prezime
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Vaše ime"
                  name="name"
                  value={contactForm.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  E-mail adresa
                </Typography>
                <TextField
                  fullWidth
                  placeholder="vas@email.com"
                  name="email"
                  required
                  value={contactForm.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  Telefon (opcionalno)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="+381 60 000 0000"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  Tema poruke
                </Typography>
                <TextField
                  fullWidth
                  placeholder="O čemu se radi?"
                  name="subject"
                  required
                  value={contactForm.subject}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </Box>

            <Box mb={4}>
              <Typography variant="body1" mb={1}>
                Vaša poruka
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Opišite detaljno vaš upit ili sugestiju..."
                name="message"
                required
                value={contactForm.message}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'common.white',
                    borderRadius: 2
                  }
                }}
              />
              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                disabled={isPending || !isFormValid}
                startIcon={<Send size={18} />}
                sx={{
                  mt: 4
                }}
              >
                Pošalji poruku
              </Button>
            </Box>
          </Box>
        </Box>

        {/* RIGHT – INFO */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card 2: Contact Information */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Ephesis', fontSize: '2rem', mb: 3 }}
            >
              Kontakt informacije
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main'
                  }}
                >
                  <Mail size={24} />
                </Box>
                <Box>
                  <Typography color="text.secondary">E-mail</Typography>
                  <Typography fontWeight={600}>info@zelenisvet.rs</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main'
                  }}
                >
                  <MapPin size={24} />
                </Box>
                <Box>
                  <Typography color="text.secondary">Adresa</Typography>
                  <Typography fontWeight={500}>
                    Poslujemo samo online
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Card 2: Support Hours */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'success.main'
                }}
              >
                <Clock style={{ width: '24px', height: '24px' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Ephesis', fontSize: '2rem' }}
              >
                Radno vrijeme podrške
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography color="text.secondary">
                  Ponedeljak - Petak
                </Typography>
                <Typography fontWeight={600}>09:00 - 17:00</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography color="text.secondary">Subota</Typography>
                <Typography fontWeight={600}>10:00 - 14:00</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography color="text.secondary">Nedjelja</Typography>
                <Typography fontWeight={600}>Zatvoreno</Typography>
              </Box>

              <Typography
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                * E-mail poruke obrađujemo i van radnog vremena
              </Typography>
            </Box>
          </Box>
          {/* Card 1: Why Communication Matters */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'warning.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'warning.main'
                }}
              >
                <Heart size={24} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Ephesis', fontSize: '2rem' }}
              >
                Zašto je komunikacija bitna?
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                {
                  title: 'Bolje razumijevanje vaših potreba',
                  desc: 'Kroz otvorenu komunikaciju možemo preciznije odgovoriti na vaša pitanja i pružiti personalizovana rešenja.'
                },
                {
                  title: 'Stalno poboljšanje usluga',
                  desc: 'Vaši komentari i sugestije nam pomažu da unaprijedimo naše proizvode i usluge.'
                },
                {
                  title: 'Izgradnja poverenja',
                  desc: 'Transparentna komunikacija je temelj dugoročnog partnerstva s našim korisnicima.'
                }
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ mt: 0.5, color: 'success.main', minWidth: 24 }}>
                    <Sparkles size={20} />
                  </Box>
                  <Box>
                    <Typography fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FAQ SECTION */}
      <Box sx={{ mt: 4, mb: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'success.light',
                color: 'success.main',
                px: 2,
                py: 0.5,
                borderRadius: 10,
                mb: 2
              }}
            >
              <Leaf size={16} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Česta pitanja
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'Ephesis',
                fontSize: '3rem',
                color: 'success.dark',
                mb: 2
              }}
            >
              Najčešća pitanja
            </Typography>
            <Typography color="text.secondary">
              Pronađite odgovore na najčešća pitanja. Ako ne pronađete odgovor,
              slobodno nas kontaktirajte.
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {[
              {
                q: 'Koliko brzo mogu očekivati odgovor na upit?',
                a: 'Trudimo se da na sva pitanja odgovorimo u roku od 24 sata tokom radnih dana. Tokom vikenda i praznika vreme odgovora može biti nešto duže.'
              },
              {
                q: 'Kako mogu da proverim status svoje porudžbine?',
                a: 'Nakon potvrde porudžbine, putem emaila dobijate kontakt podatke prodavca, kao i naše kontakt informacije. Ukoliko se prodavac ne javi u roku od 48 sati, molimo vas da nas direktno kontaktirate kako bismo pomogli u rešavanju situacije.'
              },
              {
                q: 'Da li nudite savete za izbor i negu biljaka?',
                a: 'Da! U skladu sa savremenim tehnologijama, naš tim je kreirao AI savetnika specijalizovanog za cvećarstvo i baštovanstvo. Savetniku možete pristupiti putem našeg Instagram naloga, gde vam je uvek na raspolaganju za pitanja i preporuke.'
              },
              {
                q: 'Kako mogu postati partner ili prodavac na platformi Zeleni svet?',
                a: 'Postati prodavac je jednostavno. Potrebno je da se registrujete na platformi, popunite podatke o svojoj prodavnici i potom dodate proizvode koje nudite kupcima.'
              },
              {
                q: 'Kako funkcioniše plaćanje na platformi Zeleni svet?',
                a: 'Zeleni svet ne učestvuje u procesu plaćanja između kupca i prodavca. Plaćanje se vrši isključivo direktno sa prodavcem. Ukoliko prodavnice žele da promovišu svoje proizvode ili povećaju kapacitet svoje prodavnice na platformi, plaćanje je moguće izvršiti putem PayPal-a ili platnim karticama.'
              }
            ].map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                elevation={0}
                sx={{
                  '&:before': { display: 'none' },
                  borderRadius: '12px !important',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ChevronDown style={{ width: '20px', height: '20px' }} />
                  }
                  sx={{
                    fontWeight: 600,
                    '&.Mui-expanded': { color: 'success.main' }
                  }}
                >
                  {item.q}
                </AccordionSummary>
                <AccordionDetails sx={{ color: 'text.secondary' }}>
                  {item.a}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SATISFACTION BANNER */}
      <Box
        sx={{
          bgcolor: 'info.main',
          color: 'common.white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Leaf style={{ width: 48, height: 48 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '3.5rem',
              mb: 2
            }}
          >
            Vaše zadovoljstvo je naš prioritet
          </Typography>
          <Typography sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
            Hvala vam na poverenju. Radujemo se vašoj poruci i prilici da vam
            pomognemo.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Mail />}
            sx={{
              bgcolor: 'common.white',
              color: 'success.dark',
              fontWeight: 600,
              textTransform: 'none',
              py: 1.5,
              px: 4,
              borderRadius: 10,
              '&:hover': {
                bgcolor: 'common.white'
              }
            }}
          >
            info@zelenisvet.rs
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
