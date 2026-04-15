'use client';

import {
  Box,
  Chip,
  CircularProgress,
  Tooltip,
  Typography
} from '@mui/material';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface AIVerificationBadgeProps {
  /** Whether the AI check has completed */
  verifiedDone?: boolean;
  /** Whether the content passed the AI check */
  verified?: boolean;
}

export const AIVerificationBadge = ({
  verifiedDone,
  verified
}: AIVerificationBadgeProps) => {
  const { t } = useTranslation();

  // Still checking
  if (!verifiedDone) {
    return (
      <Chip
        size="small"
        icon={
          <CircularProgress
            size={12}
            thickness={5}
            sx={{ color: 'text.secondary', ml: '6px !important' }}
          />
        }
        label={t('aiVerification.checking')}
        sx={{
          bgcolor: 'action.hover',
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: '0.72rem',
          height: 24,
          '& .MuiChip-icon': { ml: 0.5 }
        }}
      />
    );
  }

  // Passed
  if (verified) {
    return (
      <Tooltip title={t('aiVerification.verifiedTooltip')} placement="top">
        <Chip
          size="small"
          icon={<ShieldCheck size={13} style={{ marginLeft: 6 }} />}
          label={t('aiVerification.verified')}
          sx={{
            bgcolor: 'rgba(0,128,128,0.10)',
            color: 'teal',
            border: '1px solid rgba(0,128,128,0.25)',
            fontWeight: 600,
            fontSize: '0.72rem',
            height: 24,
            '& .MuiChip-icon': { color: 'teal', ml: 0 }
          }}
        />
      </Tooltip>
    );
  }

  // Failed / flagged
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Tooltip title={t('aiVerification.warningTooltip')} placement="top">
        <Chip
          size="medium"
          icon={<ShieldAlert size={13} style={{ marginLeft: 6 }} />}
          label={t('aiVerification.warning')}
          sx={{
            bgcolor: 'rgba(255,152,0,0.12)',
            color: 'warning.dark',
            border: '1px solid rgba(255,152,0,0.35)',
            fontWeight: 600,
            fontSize: '0.72rem',
            '& .MuiChip-icon': { color: 'warning.dark', ml: 0 }
          }}
        />
      </Tooltip>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1.4 }}
      >
        {t('aiVerification.warningHelper')}
      </Typography>
    </Box>
  );
};
