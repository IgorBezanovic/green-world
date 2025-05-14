import { Box } from '@mui/material';

import GIFLoader from '/loader.gif';

export const Loader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'scroll'
      }}
    >
      <Box
        component="img"
        src={GIFLoader}
        alt="Loader"
        height="75px"
        width="95px"
      />
    </Box>
  );
};
