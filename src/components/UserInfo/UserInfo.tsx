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
import clsx from 'clsx';
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
        className="w-full flex justify-center items-center"
        sx={{ height: 300 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card className={clsx('w-full', props?.customStyle)}>
      {props?.user?.shopName && (
        <CardHeader
          title={
            <Box className="flex items-center">
              <Store className="mr-2" />
              {props?.user?.shopName}
            </Box>
          }
          action={
            props?.isUserProfile && (
              <IconButton
                aria-label="Edit profile"
                onClick={() => navigate('/profile-settings/edit-profile')}
              >
                <Settings />
              </IconButton>
            )
          }
        />
      )}

      <CardContent>
        <Box className={clsx('w-full flex flex-col', props?.customStyleMeta)}>
          <Box
            className={clsx(
              'relative w-24 h-24 mx-auto mb-5',
              props?.isUserProfile && 'cursor-pointer'
            )}
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
              <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition duration-300 rounded-full group">
                <Camera className="!text-white opacity-0 group-hover:opacity-100 transition duration-300 !w-6 !h-6" />
              </Box>
            )}
          </Box>
          {props?.user?.name && (
            <Typography variant="body1" className="text-black">
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
          {props?.user?.address?.city && props?.user?.address?.country && (
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
              {`${props?.user?.address?.city}, ${props?.user?.address?.country}`}
            </Typography>
          )}
          {props?.user?.address?.street && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'secondary.main'
              }}
            >
              {props?.user?.address?.street}
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
