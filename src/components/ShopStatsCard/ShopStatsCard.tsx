import { Box, Typography, LinearProgress } from '@mui/material';
import { Package, Activity, FileText, Infinity } from 'lucide-react';

interface ShopStatsCardProps {
  numberOfProducts: number;
  maxShopProducts: number;
  numberOfActions: number;
  numberOfBlogs: number;
}

export const ShopStatsCard = ({
  numberOfProducts,
  maxShopProducts,
  numberOfActions,
  numberOfBlogs
}: ShopStatsCardProps) => {
  const productsPercentage = (numberOfProducts / maxShopProducts) * 100;

  return (
    <Box
      sx={{
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 2.5,
        boxShadow: 1
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'success.light'
              }}
            >
              <Package size={16} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Dodati proizvodi
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {numberOfProducts}
            </Typography>
            {/* <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>
              / {maxShopProducts}
            </Typography> */}
          </Box>

          <LinearProgress
            variant="determinate"
            value={productsPercentage}
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                bgcolor: 'success.main'
              }
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'info.light'
              }}
            >
              <Activity size={16} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Kreirane aktivnosti
            </Typography>
          </Box>

          <Box
            sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {numberOfActions}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              / <Infinity />
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'warning.light'
              }}
            >
              <FileText size={16} />
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Objavljeni Blogovi
            </Typography>
          </Box>
          <Box
            sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              {numberOfBlogs}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              / <Infinity />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
