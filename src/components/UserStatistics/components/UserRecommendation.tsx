import { Box, Stack, Typography } from '@mui/material';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const UserRecommendation = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 2.5,
        boxShadow: 1
      }}
    >
      <Stack direction="row" spacing={1.5} mb={1}>
        <Sparkles size={20} />
        <Typography variant="body1">{t('userRecommendation.title')}</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {t('userRecommendation.description')}
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2">{t('userRecommendation.item1')}</Typography>
        <Typography variant="body2">{t('userRecommendation.item2')}</Typography>
        <Typography variant="body2">{t('userRecommendation.item3')}</Typography>
        <Typography variant="body2">{t('userRecommendation.item4')}</Typography>
        <Typography variant="body2">{t('userRecommendation.item5')}</Typography>
      </Stack>
    </Box>
  );
};
