import { track } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    track('pageview', { path: location.pathname });
  }, [location]);

  return null;
};
