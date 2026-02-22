import {
  formatImageUrl,
  formatUrl,
  goToDestination
} from '@green-world/utils/helpers';
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Button,
  useTheme
} from '@mui/material';
import {
  Camera,
  Globe,
  Mail,
  Phone,
  Store,
  MapPin,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router';

import { SocialMedia } from '../SocialMedia';

export const UserInfo = ({ ...props }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  if (props?.userLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 300
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ width: '100%' }}>
      {props?.user?.shopName && (
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Store style={{ marginRight: 8, width: 20, height: 20 }} />
              {props?.user?.shopName}
            </Box>
          }
          action={
            props?.isUserProfile && (
              <IconButton
                aria-label="Edit profile"
                onClick={() => navigate('/profile-settings/edit-profile')}
              >
                <Settings style={{ width: 24, height: 24 }} />
              </IconButton>
            )
          }
        />
      )}

      <CardContent>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              position: 'relative',
              width: 96,
              height: 96,
              mx: 'auto',
              mb: 4,
              cursor: props?.isUserProfile ? 'pointer' : 'default'
            }}
            onClick={() =>
              props?.isUserProfile && navigate('/profile-settings/change-image')
            }
          >
            <Avatar
              src={formatImageUrl(props?.user?.profileImage, 55)}
              alt={props?.user?.name}
              sx={{
                width: 96,
                height: 96,
                mb: 2,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            />
            {props?.isUserProfile && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0)',
                  borderRadius: '50%',
                  transition: 'background-color 300ms ease',
                  '& > svg': {
                    color: '#fff',
                    opacity: 0,
                    width: 24,
                    height: 24,
                    transition: 'opacity 300ms ease'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.3)'
                  },
                  '&:hover > svg': {
                    opacity: 1
                  }
                }}
              >
                <Camera />
              </Box>
            )}
          </Box>
          {props?.user?.name && (
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              {props?.user?.name} {props?.user?.lastname}
            </Typography>
          )}
          {props?.user?.shopDescription && (
            <Typography
              variant="body2"
              sx={{
                my: 1
              }}
            >
              {props?.user?.shopDescription}
            </Typography>
          )}
          {!props.user.onlyOnline &&
            (props?.user?.address?.street ||
              props?.user?.address?.city ||
              props?.user?.address?.country) && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <MapPin />
                {[
                  props?.user?.address?.street,
                  props?.user?.address?.city,
                  props?.user?.address?.country
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Typography>
            )}
          {props?.user?.website && (
            <Typography
              component="a"
              variant="body2"
              href={formatUrl(props?.user?.website || '')}
              sx={{
                mt: 1,
                color: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Globe /> {props?.user?.website}
            </Typography>
          )}
          {props?.user?.phone && (
            <Typography
              component="a"
              variant="body2"
              href={`tel:+${props.user.phone}`}
              sx={{
                mt: 1,
                color: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Phone />
              <span>+{props.user.phone}</span>
            </Typography>
          )}
          {props?.user?.email && (
            <Typography
              component="a"
              variant="body2"
              href={`mailto:${props.user.email}`}
              sx={{
                mt: 1,
                color: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Mail />
              <span>{props.user.email}</span>
            </Typography>
          )}
          {props?.user?.address?.city && props?.user?.address?.country && (
            <Button
              component="a"
              href={goToDestination(
                props?.user?.address?.street,
                props?.user?.address?.city,
                props?.user?.address?.country
              )}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              sx={{
                mt: 2,
                p: 1
              }}
            >
              <Typography variant="body2" component="span">
                Navigacija
              </Typography>
            </Button>
          )}
          <Box sx={{ mt: 2 }}>
            <SocialMedia
              color={theme.palette.secondary.main}
              socialMediaLinks={props?.user?.socialMedia}
              size={'28px'}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
