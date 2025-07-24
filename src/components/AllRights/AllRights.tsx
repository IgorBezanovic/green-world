import { Box, Typography } from '@mui/material';

export const AllRights = () => {
  return (
    <Box sx={{ marginY: '8px', textAlign: 'center' }}>
      <Typography variant="body2" sx={{ width: '90%', mx: 'auto' }}>
        &copy; {new Date().getFullYear()} Zeleni Svet. Sva prava zadržana.
      </Typography>
    </Box>
  );
};
