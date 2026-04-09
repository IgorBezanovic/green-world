'use client';

import UserContext from '@green-world/context/UserContext';
import { useEditUser } from '@green-world/hooks/useEditUser';
import { WorkingTime } from '@green-world/utils/types';
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
  Laptop,
  Clock3
} from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

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
    sx={(theme) => ({
      display: 'flex',
      flexDirection: 'column',
      [theme.breakpoints.up('md')]: {
        flexDirection: 'row'
      },
      gap: 2,
      px: 4,
      mb: 2
    })}
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
  const { t } = useTranslation();
  const location = useLocation();
  const workingHoursRef = useRef<HTMLDivElement | null>(null);
  const { user, setUser, isLoading } = useContext(UserContext);
  const { mutate, isPending: isLoadingUser } = useEditUser();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const workingDays: Array<{ key: keyof WorkingTime; label: string }> = [
    { key: 'monday', label: t('editUserData.days.monday') },
    { key: 'tuesday', label: t('editUserData.days.tuesday') },
    { key: 'wednesday', label: t('editUserData.days.wednesday') },
    { key: 'thursday', label: t('editUserData.days.thursday') },
    { key: 'friday', label: t('editUserData.days.friday') },
    { key: 'saturday', label: t('editUserData.days.saturday') },
    { key: 'sunday', label: t('editUserData.days.sunday') }
  ];

  const defaultWorkingTimeValue = {
    open: '',
    close: '',
    isClosed: false
  };

  useEffect(() => {
    if (location.hash === '#working-hours') {
      workingHoursRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [location.hash]);

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
      return t('editUserData.validUrl', { name });
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(user);
    setErrors({});
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

  const handleWorkingTimeChange = (
    day: keyof WorkingTime,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    const existingDay = user?.workingTime?.[day] || defaultWorkingTimeValue;

    const currentWorkingTime = user?.workingTime ?? {
      monday: defaultWorkingTimeValue,
      tuesday: defaultWorkingTimeValue,
      wednesday: defaultWorkingTimeValue,
      thursday: defaultWorkingTimeValue,
      friday: defaultWorkingTimeValue,
      saturday: defaultWorkingTimeValue,
      sunday: defaultWorkingTimeValue
    };

    setUser({
      ...user,
      workingTime: {
        ...currentWorkingTime,
        [day]: {
          ...existingDay,
          [field]: value
        }
      }
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* ================= BASIC INFO ================= */}
      <Card>
        <SectionHeader
          icon={User}
          title={t('editUserData.basicInfo.title')}
          description={t('editUserData.basicInfo.description')}
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Building2}
              name="shopName"
              label={
                user?.shopName
                  ? t('editUserData.basicInfo.shopName')
                  : undefined
              }
              placeholder={t('editUserData.basicInfo.shopName')}
              value={user?.shopName || ''}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Mail}
              value={user?.email || ''}
              disabled
              label={
                user?.email
                  ? t('editUserData.basicInfo.contactEmail')
                  : undefined
              }
              placeholder={t('editUserData.basicInfo.contactEmail')}
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={User}
              name="name"
              label={
                user?.name ? t('editUserData.basicInfo.firstName') : undefined
              }
              placeholder={t('editUserData.basicInfo.firstName')}
              value={user?.name || ''}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={User}
              name="lastname"
              label={
                user?.lastname
                  ? t('editUserData.basicInfo.lastName')
                  : undefined
              }
              placeholder={t('editUserData.basicInfo.lastName')}
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
              label={
                user?.phone
                  ? t('editUserData.basicInfo.contactPhone')
                  : undefined
              }
              placeholder={t('editUserData.basicInfo.contactPhone')}
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
            placeholder={t('editUserData.basicInfo.descriptionField')}
            label={
              user?.shopDescription
                ? t('editUserData.basicInfo.descriptionField')
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
          title={t('editUserData.social.title')}
          description={t('editUserData.social.description')}
          bgColor="rgba(255, 153, 51, 0.08)"
          iconColor="warning.main"
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Instagram}
              value={user?.socialMedia?.instagram || ''}
              label={
                user?.socialMedia?.instagram
                  ? t('editUserData.social.instagram')
                  : undefined
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
              placeholder={t('editUserData.social.instagram')}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Facebook}
              value={user?.socialMedia?.facebook || ''}
              label={
                user?.socialMedia?.facebook
                  ? t('editUserData.social.facebook')
                  : undefined
              }
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
              placeholder={t('editUserData.social.facebook')}
            />
          </Box>
        </TwoColRow>

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Music2}
              value={user?.socialMedia?.tiktok || ''}
              label={
                user?.socialMedia?.tiktok
                  ? t('editUserData.social.tiktok')
                  : undefined
              }
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
              placeholder={t('editUserData.social.tiktok')}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Linkedin}
              value={user?.socialMedia?.linkedin || ''}
              label={
                user?.socialMedia?.linkedin
                  ? t('editUserData.social.linkedin')
                  : undefined
              }
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
              placeholder={t('editUserData.social.linkedin')}
            />
          </Box>
        </TwoColRow>
      </Card>

      {/* ================= LOCATION ================= */}
      <Card>
        <SectionHeader
          icon={MapPin}
          title={t('editUserData.location.title')}
          description={t('editUserData.location.description')}
        />

        <TwoColRow>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Hash}
              name="zipCode"
              disabled={user?.onlyOnline}
              value={user?.address?.zipCode || ''}
              label={
                user?.address?.zipCode
                  ? t('editUserData.location.zipCode')
                  : undefined
              }
              placeholder={t('editUserData.location.zipCode')}
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
              placeholder={t('editUserData.location.city')}
              label={
                user?.address?.city
                  ? t('editUserData.location.city')
                  : undefined
              }
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
              placeholder={t('editUserData.location.street')}
              label={
                user?.address?.street
                  ? t('editUserData.location.street')
                  : undefined
              }
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DataInput
              icon={Flag}
              name="country"
              disabled={user?.onlyOnline}
              value={user?.address?.country || ''}
              onChange={handleAddressChange}
              placeholder={t('editUserData.location.country')}
              label={
                user?.address?.country
                  ? t('editUserData.location.country')
                  : undefined
              }
            />
          </Box>
        </TwoColRow>
      </Card>

      {/* ================= SETTINGS ================= */}
      <Card>
        <SectionHeader
          icon={Laptop}
          title={t('editUserData.settings.title')}
          description={t('editUserData.settings.description')}
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
              <Typography variant="body2" color="text.secondary">
                {t('editUserData.settings.onlineOnlyTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('editUserData.settings.onlineOnlyDescription')}
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
              <Typography variant="body2" color="text.secondary">
                {t('editUserData.settings.onlyOnSiteTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('editUserData.settings.onlyOnSiteDescription')}
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

      {/* ================= WORKING HOURS ================= */}
      <Card>
        <Box id="working-hours" ref={workingHoursRef} />
        <SectionHeader
          icon={Clock3}
          title={t('editUserData.workingHours.title')}
          description={t('editUserData.workingHours.description')}
        />

        <Box sx={{ px: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {workingDays.map(({ key, label }) => {
            const dayData = user?.workingTime?.[key] || defaultWorkingTimeValue;

            return (
              <Box
                key={key}
                sx={(theme) => ({
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.05)',
                  [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: '180px 1fr 1fr auto',
                    alignItems: 'center'
                  }
                })}
              >
                <Typography variant="body1">{label}</Typography>

                <TextField
                  type="time"
                  label={t('editUserData.workingHours.opens')}
                  disabled={dayData.isClosed}
                  value={dayData.open || ''}
                  onChange={(e) =>
                    handleWorkingTimeChange(key, 'open', e.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />

                <TextField
                  type="time"
                  label={t('editUserData.workingHours.closes')}
                  disabled={dayData.isClosed}
                  value={dayData.close || ''}
                  onChange={(e) =>
                    handleWorkingTimeChange(key, 'close', e.target.value)
                  }
                  slotProps={{ inputLabel: { shrink: true } }}
                  fullWidth
                />

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minWidth: '120px'
                  }}
                >
                  <Typography variant="body2">
                    {t('editUserData.workingHours.closed')}
                  </Typography>
                  <Switch
                    checked={dayData.isClosed}
                    onChange={(e) =>
                      handleWorkingTimeChange(key, 'isClosed', e.target.checked)
                    }
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
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
          {isLoadingUser ? (
            <CircularProgress size={22} />
          ) : (
            t('editUserData.updateProfile')
          )}
        </Button>
      </Box>
    </Box>
  );
};
