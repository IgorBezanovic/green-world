import { Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';

export const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}
      ref={ref}
    >
      {inView ? children : null}
    </Box>
  );
};
