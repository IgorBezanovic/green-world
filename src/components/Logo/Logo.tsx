import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Logo = ({
  width,
  height,
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
        backgroundImage: "url('/zeleni-svet-yellow-nd-transparent.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: width || '3.5rem',
        height: height || '3.5rem',
        borderRadius: '50%',
        boxShadow: 2,
        ...sx
      }}
    />
  );
};
