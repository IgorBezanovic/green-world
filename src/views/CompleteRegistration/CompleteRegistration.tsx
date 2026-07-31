'use client';

import { PageContent } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { isValidPhoneNumber } from '@green-world/utils/phone';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Typography
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export const CompleteRegistration = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [serverError, setServerError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (value: string) =>
      request({
        url: '/user/complete-phone-setup',
        method: 'put',
        data: { phone: value }
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['userDetails', userId]
      });
      navigate('/profile');
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error) ? error.response?.data : null;
      setServerError(
        typeof message === 'string'
          ? message
          : t('completeRegistration.updateError')
      );
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValidPhoneNumber(phone)) {
      setPhoneError(t('completeRegistration.phoneError'));
      return;
    }
    mutate(phone);
  };

  return (
    <PageContent>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 560,
          mx: 'auto',
          my: 6,
          p: { xs: 3, sm: 5 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1">
          {t('completeRegistration.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('completeRegistration.description')}
        </Typography>

        <OutlinedInput
          required
          autoFocus
          type="tel"
          name="phone"
          value={phone}
          placeholder={t('completeRegistration.phonePlaceholder')}
          error={Boolean(phoneError)}
          disabled={isPending}
          onChange={(event) => {
            setPhone(event.target.value);
            setPhoneError('');
          }}
          startAdornment={
            <InputAdornment position="start">
              <PhoneOutlinedIcon />
            </InputAdornment>
          }
        />
        {phoneError && (
          <Typography variant="caption" color="error">
            {phoneError}
          </Typography>
        )}

        <Alert severity="info">{t('completeRegistration.phoneInfo')}</Alert>

        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            t('completeRegistration.submit')
          )}
        </Button>
      </Box>

      <Snackbar
        open={Boolean(serverError)}
        autoHideDuration={6000}
        onClose={() => setServerError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setServerError('')}
        >
          {serverError}
        </Alert>
      </Snackbar>
    </PageContent>
  );
};
