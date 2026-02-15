import { useFeaturedShops } from '@green-world/hooks/useFeaturedShops';
import { Box, Skeleton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import { FeaturedShopHero } from './components/FeaturedShopHero';

export const FeaturedShops = () => {
  const { data, isLoading } = useFeaturedShops();
  const hasShops = data?.length > 0;
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasShops) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % data?.length);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasShops, data?.length]);

  if (isLoading) {
    return (
      <Box sx={{ mb: 8 }}>
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <FeaturedShopHero shop={data[index]} />
    </Box>
  );
};
