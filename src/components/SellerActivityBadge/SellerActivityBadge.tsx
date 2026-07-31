'use client';

import {
  getSellerActivityLevel,
  getSellerInactiveDays,
  SELLER_ACTIVITY_COLORS,
  type SellerActivityLevel
} from '@green-world/utils/sellerActivity';
import { Chip, Tooltip } from '@mui/material';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SellerActivityBadgeProps {
  lastActiveAt?: string | Date | null;
  createdAt?: string | Date | null;
  size?: 'small' | 'medium';
}

const LABEL_KEY: Record<SellerActivityLevel, string> = {
  green: 'sellerActivity.active',
  yellow: 'sellerActivity.lessActive',
  orange: 'sellerActivity.inactive'
};

const TOOLTIP_KEY: Record<SellerActivityLevel, string> = {
  green: 'sellerActivity.activeTooltip',
  yellow: 'sellerActivity.lessActiveTooltip',
  orange: 'sellerActivity.inactiveTooltip'
};

export const SellerActivityBadge = ({
  lastActiveAt,
  createdAt,
  size = 'small'
}: SellerActivityBadgeProps) => {
  const { t } = useTranslation();
  const user = { lastActiveAt, createdAt };
  const level = getSellerActivityLevel(user);

  if (!level) return null;

  const days = getSellerInactiveDays(user);
  const colors = SELLER_ACTIVITY_COLORS[level];

  return (
    <Tooltip title={t(TOOLTIP_KEY[level], { days })} placement="top">
      <Chip
        size={size}
        icon={<Clock size={13} style={{ marginLeft: 6 }} />}
        label={t(LABEL_KEY[level])}
        sx={{
          bgcolor: colors.bgcolor,
          color: colors.color,
          border: `1px solid ${colors.border}`,
          fontWeight: 500,
          fontSize: '0.72rem',
          height: size === 'small' ? 24 : 28,
          '& .MuiChip-icon': { color: colors.icon, ml: 0 }
        }}
      />
    </Tooltip>
  );
};
