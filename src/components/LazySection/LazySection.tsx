'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const LazySection = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}
      ref={ref}
    >
      {!mounted || inView ? children : null}
    </Box>
  );
};
