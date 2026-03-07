import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

export const AllRights = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        paddingY: '10px',
        textAlign: 'center'
      }}
    >
      <Typography variant="body2" sx={{ width: '90%', mx: 'auto' }}>
        <Trans
          t={t}
          i18nKey="allRights.text"
          values={{ year: new Date().getFullYear() }}
          components={{
            link: (
              <Box
                component="a"
                href="https://www.linkedin.com/company/zeleni-svet"
                sx={{ textDecoration: 'underline', color: 'secondary.main' }}
              />
            )
          }}
        />
      </Typography>
    </Box>
  );
};
