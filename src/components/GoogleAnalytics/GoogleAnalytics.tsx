import { useGA } from '@green-world/hooks/useGA';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

export const GoogleAnalytics = () => {
  const { data, isLoading } = useGA();
  const [activeUsersData, setActiveUsersData] = useState<
    { label: string; value: number }[]
  >([]);
  const [pagesData, setPagesData] = useState<
    { page: string; sessions: number; pageViews: number }[]
  >([]);
  const [demographicType, setDemographicType] = useState<'country' | 'city'>(
    'country'
  );
  const [demographicsData, setDemographicsData] = useState<
    { label: string; value: number }[]
  >([]);
  const [bounceRate, setBounceRate] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && data) {
      setData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const setData = () => {
    // Active Users chart data
    setActiveUsersData([
      { label: 'Active Sessions', value: data?.charts?.activeUsers || 0 }
    ]);

    // Bounce Rate
    setBounceRate(Math.round((data?.charts?.overallBounceRate || 0) * 100));

    // Pages chart (sessions vs pageViews)
    setPagesData(
      Object.entries(data?.charts?.pages || {}).map(([key, value]) => {
        const pageData = value as { sessions: number; pageViews: number };
        return {
          page: key.split('|')[0],
          sessions: pageData.sessions,
          pageViews: pageData.pageViews
        };
      })
    );

    // Default demographics (country)
    setDemographicsData(
      Object.entries(data?.charts?.demographics?.byCountry || {}).map(
        ([label, value]) => ({
          label,
          value: Number(value)
        })
      )
    );
  };

  const handleDemographicChange = (type: 'country' | 'city') => {
    setDemographicType(type);
    const newData =
      type === 'country'
        ? Object.entries(data?.charts?.demographics?.byCountry || {}).map(
            ([label, value]) => ({
              label,
              value: Number(value)
            })
          )
        : Object.entries(data?.charts?.demographics?.byCity || {}).map(
            ([label, value]) => ({
              label,
              value: Number(value)
            })
          );
    setDemographicsData(newData);
  };

  const getBounceRateColor = (rate: number) => {
    if (rate < 30) return '#4caf50';
    if (rate < 60) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Google Analytics Overview (Last 30 days)
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Active Users */}
        <Paper sx={{ p: 2, flex: '1 1 300px', minWidth: 300 }}>
          <Typography variant="h6">Active Sessions</Typography>
          <BarChart
            dataset={activeUsersData}
            xAxis={[{ scaleType: 'band', dataKey: 'label' }]}
            series={[{ dataKey: 'value', color: '#4caf50' }]}
            height={200}
          />
        </Paper>

        {/* Bounce Rate */}
        <Paper
          sx={{
            p: 2,
            flex: '1 1 300px',
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Bounce Rate
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
            <CircularProgress
              variant="determinate"
              value={bounceRate}
              size={120}
              thickness={6}
              sx={{ color: getBounceRateColor(bounceRate) }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" component="div">
                {bounceRate}%
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ mt: 2, textAlign: 'center' }}>
            Bounce Rate predstavlja procenat posetilaca koji su napustili sajt
            nakon posete samo jedne stranice, bez interakcije sa drugim
            sadržajem. Podaci dolaze iz Google Analytics-a.
          </Typography>
        </Paper>

        {/* Top Pages */}
        <Paper sx={{ p: 2, flex: '2 1 600px', minWidth: 300 }}>
          <Typography variant="h6">Top Pages (Sessions & PageViews)</Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}>
            {pagesData?.slice(0, 10).map((page) => (
              <Box
                key={page.page}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography>{page.page}</Typography>
                <Typography>
                  {page.sessions} sessions / {page.pageViews} views
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Demographics */}
        <Paper sx={{ p: 2, flex: '1 1 300px', minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Demographics
          </Typography>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Select
              value={demographicType}
              onChange={(e) =>
                handleDemographicChange(e.target.value as 'country' | 'city')
              }
            >
              <MenuItem value="country">Country</MenuItem>
              <MenuItem value="city">City</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {demographicsData.map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                  p: 1,
                  borderRadius: 1,
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography>{item.label}</Typography>
                <Typography>{item.value}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
