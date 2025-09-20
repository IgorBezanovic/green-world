import { Box, Typography } from '@mui/material';

export const AllRights = () => {
  return (
    <Box
      sx={{
        paddingY: '10px',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" sx={{ width: '90%', mx: 'auto' }}>
        &copy; {new Date().getFullYear()}{' '}
        <Box
          component="a"
          href="https://www.linkedin.com/company/zeleni-svet"
          sx={{ textDecoration: 'underline', color: 'secondary.main' }}
        >
          Zeleni Svet
        </Box>
        . Sva prava zadržana.
      </Typography>
    </Box>
  );
};
