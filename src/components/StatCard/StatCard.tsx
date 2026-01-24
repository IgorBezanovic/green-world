import { Card, Box, Typography } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  title: string;
  subtitle: string;
}

export const StatCard = ({
  icon: Icon,
  value,
  title,
  subtitle
}: StatCardProps) => {
  return (
    <Card
      sx={(theme) => ({
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.300',
        boxShadow: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        [theme.breakpoints.down('sm')]: {
          alignItems: 'center'
        }
      })}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {/* Icon */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'success.light',
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon size={22} />
        </Box>

        {/* Value */}
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </Box>

      {/* Title */}
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography variant="body1" color="text.secondary">
        {subtitle}
      </Typography>
    </Card>
  );
};
