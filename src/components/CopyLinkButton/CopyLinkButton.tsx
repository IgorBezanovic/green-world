import { Box, Chip } from '@mui/material';
import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const CopyLinkButton = ({
  successMessage,
  errorMessage
}: {
  successMessage: string;
  errorMessage: string;
}) => {
  const { t } = useTranslation();

  const handleClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        toast.success(successMessage);
      })
      .catch(() => {
        toast.error(errorMessage);
      });
  };

  return (
    <Chip
      aria-label="copy-link"
      variant="outlined"
      color="secondary"
      onClick={handleClick}
      sx={{
        height: 55,
        borderRadius: 999,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 10px 30px rgb(15 23 42 / 0.06)',
        '& .MuiChip-label': {
          px: 1.75,
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }
      }}
      label={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Copy size={16} /> {t('copyLinkButton.label')}
        </Box>
      }
    />
  );
};
