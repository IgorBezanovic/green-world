import { User } from '@green-world/utils/types';
import { Box, Typography, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export const StatsBarChart = ({ user }: { user: User }) => {
  const theme = useTheme();

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
          Pregledi po tipu sadržaja
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Uporedni prikaz ukupnih pregleda i proseka
        </Typography>

        <Box sx={{ width: '100%', height: 260 }}>
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                data: ['Proizvodi', 'Aktivnosti', 'Blogovi']
              }
            ]}
            series={[
              {
                label: 'Ukupno',
                data: [
                  user.statistics.totalViews.products,
                  user.statistics.totalViews.actions,
                  user.statistics.totalViews.blogs
                ],
                color: theme.palette.success.main
              },
              {
                label: 'Prosek',
                data: [
                  user.statistics.averageViews.product,
                  user.statistics.averageViews.action,
                  user.statistics.averageViews.blog
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
