import { Card, Box, Typography, Chip } from '@mui/material';
import { LucideIcon } from 'lucide-react';

interface PromotionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  badgeLabel?: string;
  variant?: 'success' | 'warning';
  onActionClick?: () => void;
}

export const PromotionCard = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  badgeLabel,
  variant = 'success',
  onActionClick
}: PromotionCardProps) => {
  const isSuccess = variant === 'success';

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        p: 3,
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isSuccess ? 'success.light' : 'warning.light',
        boxShadow: 'none',
        background: isSuccess
          ? 'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)'
          : 'linear-gradient(180deg, #FFF5EC 0%, #FFFFFF 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {badgeLabel && (
        <Chip
          label={badgeLabel}
          size="small"
          sx={{
            position: 'absolute',
            top: -10,
            right: 16,
            fontWeight: 600,
            bgcolor: isSuccess ? 'success.main' : 'warning.main',
            color: '#fff'
          }}
        />
      )}

      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: isSuccess ? 'success.light' : 'warning.light',
          color: isSuccess ? 'success.main' : 'warning.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={22} />
      </Box>

      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      {actionLabel && (
        <Box sx={{ mt: 'auto' }} onClick={onActionClick}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              cursor: onActionClick ? 'pointer' : 'default',
              color: isSuccess ? 'success.main' : 'warning.main',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              border: 'none',
              background: 'none',
              padding: 0,
              font: 'inherit'
            }}
          >
            {actionLabel} →
          </Typography>
        </Box>
      )}
    </Card>
  );
};
