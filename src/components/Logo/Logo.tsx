import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Logo = ({
  width = '3.5rem',
  height = '3.5rem',
  sx
}: {
  width?: string;
  height?: string;
  sx?: React.CSSProperties;
}) => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate('/')}
      aria-label="Home"
      sx={{
        display: 'flex',
        borderRadius: '50%',
        boxShadow: 2,
        padding: 0,
        width,
        height,
        ...sx
      }}
    >
      <img
        src="/zeleni-svet-yellow-nd-transparent.webp"
        alt="Zeleni svet logo"
        width="100%"
        height="100%"
        style={{ objectFit: 'cover', borderRadius: '50%' }}
        decoding="async"
        fetchPriority="high"
      />
    </IconButton>
  );
};
