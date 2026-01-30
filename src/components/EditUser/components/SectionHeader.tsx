import { Box, Stack, Typography } from '@mui/material';
import { LucideIcon } from 'lucide-react';

type SectionHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
};

export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  bgColor = 'rgba(46, 125, 50, 0.08)',
  iconColor = 'success.main'
}: SectionHeaderProps) => {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={{
        p: 2.5,
        backgroundColor: bgColor,
        mb: 3,
        gap: 2
      }}
    >
      {/* LEFT */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: iconColor,
            color: 'common.white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon color={'white'} style={{ width: 24, height: 24 }} />
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            textAlign: 'left',
            minWidth: 0
          }}
        >
          <Typography fontWeight={600}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};
