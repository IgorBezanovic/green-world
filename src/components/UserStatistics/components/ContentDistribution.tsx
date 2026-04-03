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
  const contentDistribution = user.statistics?.contentDistribution;
  const products = Number(contentDistribution?.products ?? 0);
  const actions = Number(contentDistribution?.actions ?? 0);
  const blogs = Number(contentDistribution?.blogs ?? 0);
  const services = Number(contentDistribution?.services ?? 0);

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
                  value: products,
                  label: t('contentDistribution.products')
                },
                {
                  id: 1,
                  value: actions,
                  label: t('contentDistribution.activities')
                },
                {
                  id: 2,
                  value: blogs,
                  label: t('contentDistribution.blogs')
                },
                {
                  id: 3,
                  value: services,
                  label: t('contentDistribution.services')
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
          value={products}
        />
        <LegendItem
          label={t('contentDistribution.activities')}
          value={actions}
        />
        <LegendItem label={t('contentDistribution.blogs')} value={blogs} />
        <LegendItem
          label={t('contentDistribution.services')}
          value={services}
        />
      </Stack>
    </Box>
  );
};
