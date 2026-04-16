import { Box } from '@mui/material';

type ResponsiveCardGridProps = {
  children: React.ReactNode;
};

export const ResponsiveCardGrid = ({ children }: ResponsiveCardGridProps) => {
  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        gap: 3,
        maxWidth: '1400px',
        width: '100%',
        mx: 'auto',
        gridTemplateColumns: 'repeat(1, 1fr)',
        '@media (min-width: 600px)': {
          gridTemplateColumns: 'repeat(2, 1fr)'
        },
        '@media (min-width: 1000px)': {
          gridTemplateColumns: 'repeat(3, 1fr)'
        },
        '@media (min-width: 1200px)': {
          gridTemplateColumns: 'repeat(4, 1fr)'
        }
      }}
    >
      {children}
    </Box>
  );
};
