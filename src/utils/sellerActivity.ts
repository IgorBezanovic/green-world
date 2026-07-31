export const SELLER_ACTIVE_DAYS = 14;
export const SELLER_LESS_ACTIVE_DAYS = 21;

/** Kept for callers that check "should show caution notice". */
export const SELLER_INACTIVE_DAYS = SELLER_ACTIVE_DAYS;

export type SellerActivityLevel = 'green' | 'yellow' | 'orange';

type ActivityTimestamps = {
  lastActiveAt?: string | Date | null;
  createdAt?: string | Date | null;
};

export const SELLER_ACTIVITY_COLORS: Record<
  SellerActivityLevel,
  { bgcolor: string; color: string; border: string; icon: string }
> = {
  green: {
    bgcolor: 'rgba(129, 199, 132, 0.18)',
    color: '#388e3c',
    border: 'rgba(129, 199, 132, 0.45)',
    icon: '#66bb6a'
  },
  yellow: {
    bgcolor: 'rgba(255, 241, 118, 0.35)',
    color: '#9e6a00',
    border: 'rgba(255, 213, 79, 0.70)',
    icon: '#fbc02d'
  },
  orange: {
    bgcolor: 'rgba(255, 183, 77, 0.22)',
    color: '#ef6c00',
    border: 'rgba(255, 167, 38, 0.55)',
    icon: '#ffa726'
  }
};

export const getSellerLastActiveAt = (
  user?: ActivityTimestamps | null
): Date | null => {
  if (!user) return null;

  // Prefer real activity; do not use updatedAt (bumped by product counts, edits, etc.)
  const raw = user.lastActiveAt ?? user.createdAt;
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSellerInactiveDays = (
  user?: ActivityTimestamps | null
): number | null => {
  const lastActiveAt = getSellerLastActiveAt(user);
  if (!lastActiveAt) return null;

  const ms = Date.now() - lastActiveAt.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};

/** green: aktivan (<14), yellow: manje aktivan (14–20), orange: neaktivan (21+) */
export const getSellerActivityLevel = (
  user?: ActivityTimestamps | null
): SellerActivityLevel | null => {
  const days = getSellerInactiveDays(user);
  if (days == null) return null;
  if (days < SELLER_ACTIVE_DAYS) return 'green';
  if (days < SELLER_LESS_ACTIVE_DAYS) return 'yellow';
  return 'orange';
};

export const shouldShowSellerActivityNotice = (
  user?: ActivityTimestamps | null
): boolean => {
  const level = getSellerActivityLevel(user);
  return level === 'yellow' || level === 'orange';
};

/** @deprecated use shouldShowSellerActivityNotice */
export const isSellerInactive = shouldShowSellerActivityNotice;
