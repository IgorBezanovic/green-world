import { Box } from '@mui/material';
import clsx from 'clsx';
import { useInView } from 'react-intersection-observer';

export const LazySection = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <Box className={clsx('flex', 'flex-col', 'gap-7', 'w-full')} ref={ref}>
      {inView ? children : null}
    </Box>
  );
};
