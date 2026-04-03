import { User } from '@green-world/utils/types';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTranslation } from 'react-i18next';

export const StatsBarChart = ({ user }: { user: User }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const totalViews = user.statistics?.totalViews;
  const averageViews = user.statistics?.averageViews;

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
      <Box sx={{ pb: 2.5 }}>
        <Typography fontWeight={600} mb={2}>
          {t('statsBarChart.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {t('statsBarChart.subtitle')}
        </Typography>

        <Box sx={{ width: '100%', height: 260 }}>
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                data: [
                  t('statsBarChart.products'),
                  t('statsBarChart.activities'),
                  t('statsBarChart.blogs'),
                  t('statsBarChart.services')
                ]
              }
            ]}
            series={[
              {
                label: t('statsBarChart.total'),
                data: [
                  Number(totalViews?.products ?? 0),
                  Number(totalViews?.actions ?? 0),
                  Number(totalViews?.blogs ?? 0),
                  Number(totalViews?.services ?? 0)
                ],
                color: theme.palette.success.main
              },
              {
                label: t('statsBarChart.average'),
                data: [
                  Number(averageViews?.product ?? 0),
                  Number(averageViews?.action ?? 0),
                  Number(averageViews?.blog ?? 0),
                  Number(averageViews?.service ?? 0)
                ],
                color: theme.palette.primary.main
              }
            ]}
            height={260}
            grid={{ horizontal: true }}
            slotProps={{
              legend: {
                direction: 'horizontal',
                position: { vertical: 'bottom', horizontal: 'center' }
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
