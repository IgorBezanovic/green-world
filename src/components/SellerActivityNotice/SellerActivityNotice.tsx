'use client';

import {
  getSellerActivityLevel,
  SELLER_ACTIVITY_COLORS,
  shouldShowSellerActivityNotice
} from '@green-world/utils/sellerActivity';
import { Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface SellerActivityNoticeProps {
  lastActiveAt?: string | Date | null;
  createdAt?: string | Date | null;
}

export const SellerActivityNotice = ({
  lastActiveAt,
  createdAt
}: SellerActivityNoticeProps) => {
  const { t } = useTranslation();
  const user = { lastActiveAt, createdAt };

  if (!shouldShowSellerActivityNotice(user)) return null;

  const level = getSellerActivityLevel(user);
  if (!level || level === 'green') return null;

  const colors = SELLER_ACTIVITY_COLORS[level];

  return (
    <Alert
      severity="warning"
      variant="outlined"
      sx={{
        mt: 0,
        mb: 2,
        borderRadius: 2,
        width: '100%',
        bgcolor: colors.bgcolor,
        borderColor: colors.border,
        color: colors.color,
        '& .MuiAlert-icon': { color: colors.icon },
        '& .MuiAlert-message': {
          width: '100%',
          minWidth: 0,
          overflowWrap: 'anywhere'
        }
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25 }}>
        {t(
          level === 'yellow'
            ? 'sellerActivity.noticeTitleLessActive'
            : 'sellerActivity.noticeTitleInactive'
        )}
      </Typography>
      <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
        {t(
          level === 'yellow'
            ? 'sellerActivity.noticeBodyLessActive'
            : 'sellerActivity.noticeBodyInactive'
        )}
      </Typography>
    </Alert>
  );
};
