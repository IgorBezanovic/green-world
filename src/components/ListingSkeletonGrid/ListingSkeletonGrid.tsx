import { Box, Card, CardContent, Skeleton } from '@mui/material';

export const ListingSkeletonGrid = () => (
  <Box
    component="section"
    sx={(theme) => ({
      width: '100%',
      minHeight: '70vh',
      display: 'grid',
      gap: '24px',
      gridTemplateColumns: 'repeat(1, 1fr)',
      [theme.breakpoints.up('xs')]: {
        gridTemplateColumns: 'repeat(2, 1fr)'
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)'
      },
      [theme.breakpoints.up('lgm')]: {
        gridTemplateColumns: 'repeat(4, 1fr)'
      }
    })}
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <Card key={index} sx={{ width: '100%', minWidth: 0 }}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={18} width="50%" />
          <Skeleton variant="text" height={28} width="85%" />
          <Skeleton variant="text" height={20} width="95%" />
          <Skeleton variant="text" height={20} width="70%" />
          <Box sx={{ mt: 2, pt: 2 }}>
            <Skeleton variant="text" height={20} width="60%" />
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
);
