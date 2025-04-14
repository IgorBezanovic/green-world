import { Divider as MUIDivider, Typography, Box } from '@mui/material';

interface CustomDividerProps {
  text?: string;
}

export const Divider = ({ text }: CustomDividerProps) => {
  return (
    <Box component="section" display="flex" alignItems="center" width="100%">
      <MUIDivider
        sx={{
          flex: 1,
          bgcolor: 'forestGreen'
        }}
      />
      {text && (
        <>
          <Typography
            variant="h6"
            sx={{
              mx: 2,
              textTransform: 'uppercase',
              color: 'forestGreen',
              fontWeight: 300,
              textAlign: 'center'
            }}
          >
            {text}
          </Typography>
          <MUIDivider
            sx={{
              flex: 1,
              bgcolor: 'forestGreen'
            }}
          />
        </>
      )}
    </Box>
  );
};
