import { User } from '@green-world/utils/types';
import { Box, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTranslation } from 'react-i18next';

const LegendItem = ({ label, value }: { label: string; value: number }) => (
  <Stack spacing={0.5} alignItems="center">
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={600}>
      {value}
    </Typography>
  </Stack>
);

export const ContentDistribution = ({ user }: { user: User }) => {
  const { t } = useTranslation();
  const { contentDistribution } = user.statistics;

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
      <Typography fontWeight={600} mb={0.5}>
        {t('contentDistribution.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        {t('contentDistribution.description')}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart
          series={[
            {
              data: [
                {
                  id: 0,
                  value: contentDistribution.products,
                  label: t('contentDistribution.products')
                },
                {
                  id: 1,
                  value: contentDistribution.actions,
                  label: t('contentDistribution.activities')
                },
                {
                  id: 2,
                  value: contentDistribution.blogs,
                  label: t('contentDistribution.blogs')
                }
              ],
              innerRadius: 50,
              outerRadius: 80,
              paddingAngle: 3
            }
          ]}
          width={260}
          height={180}
        />
      </Box>

      <Stack direction="row" justifyContent="center" mt={2} px={1} spacing={2}>
        <LegendItem
          label={t('contentDistribution.products')}
          value={contentDistribution.products}
        />
        <LegendItem
          label={t('contentDistribution.activities')}
          value={contentDistribution.actions}
        />
        <LegendItem
          label={t('contentDistribution.blogs')}
          value={contentDistribution.blogs}
        />
      </Stack>
    </Box>
  );
};
