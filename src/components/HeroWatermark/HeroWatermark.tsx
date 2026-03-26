import { ZSLogoLogoMark } from '@green-world/components/AppLogos';
import { Box } from '@mui/material';

interface HeroWatermarkProps {
  count?: number;
  opacity?: number;
}

export const HeroWatermark = ({
  count = 160,
  opacity = 0.14
}: HeroWatermarkProps) => {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
        gridAutoRows: '125px',
        placeItems: 'center',
        opacity,
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ width: 64, height: 80 }}>
          <ZSLogoLogoMark color="rgba(255,255,255,0.75)" />
        </Box>
      ))}
    </Box>
  );
};
