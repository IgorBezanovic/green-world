import { Typography, TypographyProps } from '@mui/material';

export const PageTitle = ({ children, sx, ...props }: TypographyProps) => {
  return (
    <Typography
      component="h1"
      sx={[
        (theme) => ({
          color: 'secondary.main',
          fontSize: '3rem',
          [theme.breakpoints.up('md')]: { fontSize: '3.75rem' },
          fontFamily: 'var(--font-ephesis, Ephesis), cursive',
          mx: 'auto',
          lineHeight: 1
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : [])
      ]}
      {...props}
    >
      {children}
    </Typography>
  );
};
