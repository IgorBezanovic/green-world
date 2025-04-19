import { Divider as MUIDivider, Typography, Box } from '@mui/material';

interface CustomDividerProps {
  text?: string;
}

export const Divider = ({ text }: CustomDividerProps) => {
  return (
    <Box component="section" display="flex" alignItems="center" width="100%">
      <MUIDivider sx={{ flex: 1 }} />
      {text && (
        <>
          <Typography
            variant="subtitle1"
            color="forestGreen"
            sx={{
              mx: 2,
              textTransform: 'uppercase'
            }}
          >
            {text}
          </Typography>
          <MUIDivider sx={{ flex: 1 }} />
        </>
      )}
    </Box>
  );
};
