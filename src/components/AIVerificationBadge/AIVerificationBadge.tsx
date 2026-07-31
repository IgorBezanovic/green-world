'use client';

import {
  Box,
  Chip,
  CircularProgress,
  Tooltip,
  Typography
} from '@mui/material';
import { ShieldCheck, ShieldAlert, ShieldQuestionMark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface AIVerificationBadgeProps {
  /** Whether the AI check has completed */
  verifiedDone?: boolean;
  /** Whether the content passed the AI check */
  verified?: boolean;
  /** Technical failure during AI check (not a content flag) */
  verificationError?: boolean;
  /** Human-readable reason from AI / system */
  reason?: string;
  /** Individual violation descriptions */
  violations?: string[];
}

export const AIVerificationBadge = ({
  verifiedDone,
  verified,
  verificationError,
  reason,
  violations
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
  if (verified && !verificationError) {
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

  // Technical error — pending manual review
  if (verificationError) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Tooltip title={t('aiVerification.pendingTooltip')} placement="top">
          <Chip
            size="small"
            icon={<ShieldQuestionMark size={13} style={{ marginLeft: 6 }} />}
            label={t('aiVerification.pending')}
            sx={{
              bgcolor: 'rgba(33,150,243,0.10)',
              color: 'info.dark',
              border: '1px solid rgba(33,150,243,0.30)',
              fontWeight: 600,
              fontSize: '0.72rem',
              height: 24,
              '& .MuiChip-icon': { color: 'info.dark', ml: 0 }
            }}
          />
        </Tooltip>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.4 }}
        >
          {t('aiVerification.pendingHelper')}
        </Typography>
      </Box>
    );
  }

  const detailLines = [
    ...(reason ? [reason] : []),
    ...(violations ?? []).slice(0, 5)
  ].filter(Boolean);

  const helperText =
    detailLines.length > 0
      ? detailLines.join(' · ')
      : t('aiVerification.warningHelper');

  // Failed / flagged
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0.5
      }}
    >
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
        {helperText}
      </Typography>
    </Box>
  );
};
