'use client';

import { UserPreview } from '@green-world/hooks/useHomeItems';
import { formatImageUrl } from '@green-world/utils/helpers';
import MapPinIcon from '@mui/icons-material/Place';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router';

interface UserPreviewCardProps {
  user: UserPreview;
}

export const UserPreviewCard = ({ user }: UserPreviewCardProps) => {
  const navigate = useNavigate();

  const avatarSrc = user.profileImage?.includes('cloudinary')
    ? `${user.profileImage}?format=webp&width=200`
    : formatImageUrl(user.profileImage || '', 55);

  const displayName =
    user.shopName || `${user.name ?? ''} ${user.lastname ?? ''}`.trim();
  const city = user.address?.city;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 1,
        borderRadius: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: 4 }
      }}
    >
      <CardActionArea
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch'
        }}
        onClick={() => navigate(`/shop/${user._id}`)}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1.5,
            py: 3
          }}
        >
          <Avatar
            src={avatarSrc}
            alt={displayName}
            sx={{ width: 72, height: 72 }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {displayName}
            </Typography>
            {city && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  mt: 0.5
                }}
              >
                <MapPinIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {city}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
