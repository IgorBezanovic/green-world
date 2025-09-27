import { Button, CircularProgress, styled } from '@mui/material';
import { Sparkles } from 'lucide-react';

type AiButtonProps = {
  isAiLoading: boolean;
  canGenerate: boolean;
  onClick: () => void;
};

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: Number(theme.shape.borderRadius) * 2,
  padding: theme.spacing(1, 3),
  fontWeight: 500,
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: theme.palette.primary.contrastText,
  transition: 'all 0.3s ease',
  minWidth: 180,

  '&:hover': {
    opacity: 0.9,
    transform: 'scale(1.01)',
    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
  },

  '&:active': {
    transform: 'scale(0.98)'
  },

  '&.Mui-disabled': {
    opacity: 0.6,
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled
  },

  // Isključi hover na tabletu i mobilnom
  [theme.breakpoints.down('md')]: {
    '&:hover': {
      opacity: 1,
      transform: 'none',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
    }
  }
}));

export const AiButton = ({
  isAiLoading,
  canGenerate,
  onClick
}: AiButtonProps) => {
  return (
    <GradientButton
      variant="contained"
      onClick={onClick}
      disabled={!canGenerate || isAiLoading}
      startIcon={!isAiLoading && <Sparkles color="white" />}
    >
      {isAiLoading ? (
        <CircularProgress
          size={20}
          thickness={5}
          sx={{ color: (theme) => theme.palette.primary.main }}
        />
      ) : (
        'Generiši opis'
      )}
    </GradientButton>
  );
};
