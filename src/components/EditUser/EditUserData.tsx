import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Typography,
  Switch
} from '@mui/material';
import {
  User,
  Mail,
  Phone,
  Globe,
  FileText,
  Instagram,
  Facebook,
  Music2,
  Linkedin,
  MapPin,
  Hash,
  Building2,
  Flag,
  Laptop
} from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { SectionHeader } from './components';

const Card = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      backgroundColor: 'background.paper',
      borderRadius: 2,
      py: 4,
      mb: 4,
      boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
    }}
  >
    {children}
  </Box>
);

const TwoColRow = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      px: 4,
      mb: 2
    }}
  >
    {children}
  </Box>
);

const DataInput = ({ icon: Icon, ...props }: any) => (
  <TextField
    variant="outlined"
    fullWidth
    label={props.label}
    placeholder={props.placeholder}
    slotProps={{
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <Icon />
          </InputAdornment>
        )
      }
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 2
      }
    }}
    {...props}
  />
);

export const EditUserData = () => {
  const { user, setUser, isLoading } = useContext(UserContext);
  const { mutate, isPending: isLoadingUser } = useEditUser();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  type SocialMediaKeys = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';

  const socialMediaRegex = {
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._%-]+\/?$/,
    facebook: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._%-]+\/?$/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@?[A-Za-z0-9._%-]+\/?$/,
    linkedin:
      /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9._%-]+\/?$/
  };
  const clearError = (key: SocialMediaKeys) => {
    setErrors((prev) => ({
      ...prev,
      [key]: undefined
    }));
  };

  const handleBlurSocialMedia = (key: SocialMediaKeys) => {
    const value = user?.socialMedia?.[key] || '';
    const error = validateSocialMedia(key, value);
    setErrors((prev) => ({
      ...prev,
      [key]: error || undefined
    }));
  };

  const validateSocialMedia = (name: string, value: string) => {
    if (!value) return '';
    if (!socialMediaRegex[name as keyof typeof socialMediaRegex].test(value)) {
      return `Unesite validan ${name} URL.`;
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(user);
    setErrors({});
    toast.success('Uspešno ste editovali profil.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      address: { ...user.address, [name]: value }
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* ================= BASIC INFO ================= */}
      <Card>
        <SectionHeader
          icon={User}
          title="Osnovni podaci"
          description="Vaši poslovni i kontakt podaci"
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Building2}
              name="shopName"
              label={
                user?.shopName
                  ? 'Naziv vašeg biznisa / shop-a / usluge'
                  : undefined
              }
              placeholder="Naziv vašeg biznisa / shop-a / usluge"
              value={user?.shopName || ''}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Mail}
              value={user?.email || ''}
              disabled
              label={user?.email ? 'Kontakt email adresa' : undefined}
              placeholder="Kontakt email adresa"
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={User}
              name="name"
              label={user?.name ? 'Ime vlasnika / kontakt osobe' : undefined}
              placeholder="Ime vlasnika / kontakt osobe"
              value={user?.name || ''}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={User}
              name="lastname"
              label={
                user?.lastname ? 'Prezime vlasnika / kontakt osobe' : undefined
              }
              placeholder="Prezime vlasnika / kontakt osobe"
              value={user?.lastname || ''}
              onChange={handleChange}
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Phone}
              name="phone"
              label={user?.phone ? 'Kontakt telefon' : undefined}
              placeholder="Kontakt telefon"
              value={user?.phone || ''}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Globe}
              name="website"
              value={user?.website || ''}
              label={user?.website ? 'Website' : undefined}
              placeholder="Website"
              onChange={handleChange}
            />
          </Box>
        </TwoColRow>

        <Box sx={{ px: 4, mt: 2 }}>
          <DataInput
            icon={FileText}
            multiline
            rows={4}
            name="shopDescription"
            value={user?.shopDescription || ''}
            onChange={handleChange}
            placeholder="Opis Vašeg biznisa, usluga i proizvoda"
            label={
              user?.shopDescription
                ? 'Opis Vašeg biznisa, usluga i proizvoda'
                : undefined
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                borderRadius: 2
              },
              '& .MuiOutlinedInput-input': {
                padding: '0 12px'
              },
              '& .MuiOutlinedInput-inputMultiline': {
                padding: '0 12px'
              }
            }}
          />
        </Box>
      </Card>

      {/* ================= SOCIAL MEDIA ================= */}
      <Card>
        <SectionHeader
          icon={Globe}
          title="Društvene mreže"
          description="Povežite Vaše profile na društvenim mrežama"
          bgColor="rgba(255, 153, 51, 0.08)"
          iconColor="warning.main"
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Instagram}
              value={user?.socialMedia?.instagram || ''}
              label={
                user?.socialMedia?.instagram ? 'Instagram link' : undefined
              }
              error={errors.instagram}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                (clearError('instagram'),
                  setUser({
                    ...user,
                    socialMedia: {
                      ...user.socialMedia,
                      instagram: e.target.value
                    }
                  }));
              }}
              onBlur={() => handleBlurSocialMedia('instagram')}
              placeholder="Instagram link"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Facebook}
              value={user?.socialMedia?.facebook || ''}
              label={user?.socialMedia?.facebook ? 'Facebook link' : undefined}
              error={errors.facebook}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                (clearError('facebook'),
                  setUser({
                    ...user,
                    socialMedia: {
                      ...user.socialMedia,
                      facebook: e.target.value
                    }
                  }));
              }}
              onBlur={() => handleBlurSocialMedia('facebook')}
              placeholder="Facebook link"
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Music2}
              value={user?.socialMedia?.tiktok || ''}
              label={user?.socialMedia?.tiktok ? 'TikTok link' : undefined}
              error={errors.tiktok}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                (clearError('tiktok'),
                  setUser({
                    ...user,
                    socialMedia: {
                      ...user.socialMedia,
                      tiktok: e.target.value
                    }
                  }));
              }}
              onBlur={() => handleBlurSocialMedia('tiktok')}
              placeholder="TikTok link"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Linkedin}
              value={user?.socialMedia?.linkedin || ''}
              label={user?.socialMedia?.linkedin ? 'LinkedIn link' : undefined}
              error={errors.linkedin}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                (clearError('linkedin'),
                  setUser({
                    ...user,
                    socialMedia: {
                      ...user.socialMedia,
                      linkedin: e.target.value
                    }
                  }));
              }}
              onBlur={() => handleBlurSocialMedia('linkedin')}
              placeholder="LinkedIn link"
            />
          </Box>
        </TwoColRow>
      </Card>

      {/* ================= LOCATION ================= */}
      <Card>
        <SectionHeader
          icon={MapPin}
          title="Lokacija"
          description="Ukoliko imate fizičku radnju / poslovnicu, unesite Vašu adresu"
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Hash}
              name="zipCode"
              disabled={user?.onlyOnline}
              value={user?.address?.zipCode || ''}
              label={user?.address?.zipCode ? 'Poštanski broj' : undefined}
              placeholder="Poštanski broj"
              onChange={handleAddressChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Building2}
              name="city"
              disabled={user?.onlyOnline}
              value={user?.address?.city || ''}
              onChange={handleAddressChange}
              placeholder="Grad"
              label={user?.address?.city ? 'Grad' : undefined}
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={MapPin}
              name="street"
              disabled={user?.onlyOnline}
              value={user?.address?.street || ''}
              onChange={handleAddressChange}
              placeholder="Ulica"
              label={user?.address?.street ? 'Ulica' : undefined}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Flag}
              name="country"
              disabled={user?.onlyOnline}
              value={user?.address?.country || ''}
              onChange={handleAddressChange}
              placeholder="Država"
              label={user?.address?.country ? 'Država' : undefined}
            />
          </Box>
        </TwoColRow>
      </Card>

      {/* ================= SETTINGS ================= */}
      <Card>
        <SectionHeader
          icon={Laptop}
          title="Podešavanja rada"
          description="Ukoliko radite online ili isključivo preko ovog sajta ćekirajte opcije ispod"
          bgColor="rgba(255, 153, 51, 0.08)"
          iconColor="warning.main"
        />

        <TwoColRow>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 2
            }}
          >
            <Box>
              <Typography fontWeight={600}>Radite samo online?</Typography>
              <Typography variant="body2" color="text.secondary">
                Vaše usluge su dostupne samo putem interneta
              </Typography>
            </Box>
            <Switch
              checked={user?.onlyOnline}
              onChange={(e) =>
                setUser({ ...user, onlyOnline: e.target.checked })
              }
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: 2
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                Poslujete samo preko ovog sajta?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kontakt isključivo preko Zeleni Svet platforme
              </Typography>
            </Box>
            <Switch
              checked={user?.onlyOnThisSite}
              onChange={(e) =>
                setUser({ ...user, onlyOnThisSite: e.target.checked })
              }
            />
          </Box>
        </TwoColRow>
      </Card>

      {/* SAVE BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoadingUser}
          sx={{ px: 4, borderRadius: 1 }}
        >
          {isLoadingUser ? <CircularProgress size={22} /> : 'Ažuriraj profil'}
        </Button>
      </Box>
    </Box>
  );
};
