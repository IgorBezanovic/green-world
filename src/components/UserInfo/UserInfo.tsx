import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import clsx from 'clsx';
import { Camera, Edit3, Globe, Mail, Phone, Store, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import ZSlogo from '/zeleni-svet-yellow-transparent.png';

export const UserInfo = ({ ...props }) => {
  const navigate = useNavigate();

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

  console.log(props);
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
                <Edit3 />
              </IconButton>
            )
          }
        />
      )}

      <CardContent>
        <Box className={clsx('w-full flex flex-col', props?.customStyleMeta)}>
          {/* Avatar */}
          <Box
            className={clsx(
              'relative w-24 h-24 mx-auto mb-5',
              props?.isUserProfile && 'cursor-pointer'
            )}
            onClick={() => props?.isUserProfile && navigate('/Edit-image')}
          >
            <Avatar
              src={props?.user?.profileImage || ZSlogo}
              sx={{ width: 96, height: 96 }}
            />
            {props?.isUserProfile && (
              <Box className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition duration-300 rounded-full group">
                <Camera className="!text-white opacity-0 group-hover:opacity-100 transition duration-300 !w-6 !h-6" />
              </Box>
            )}
          </Box>

          {/* Name */}
          {props?.user?.name && (
            <Typography variant="body1" className="text-black">
              {props?.user?.name} {props?.user?.lastname}
            </Typography>
          )}

          {/* Shop Description */}
          {props?.user?.shopDescription && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                my: 1
              }}
            >
              {props?.user?.shopDescription}
            </Typography>
          )}

          {/* Address */}
          {props?.user?.address?.city && props?.user?.address?.country && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'custom.forestGreen',
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
                color: 'custom.forestGreen'
              }}
            >
              {props?.user?.address?.street}
            </Typography>
          )}

          {/* Website */}
          {props?.user?.website && (
            <Typography
              component="a"
              variant="body2"
              href={props?.user?.website || '/'}
              sx={{
                mt: 1,
                color: 'custom.forestGreen',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Globe /> {props?.user?.website}
            </Typography>
          )}

          {/* Phone */}
          {props?.user?.phone && (
            <Typography
              component="a"
              variant="body2"
              href={`tel:+${props.user.phone}`}
              sx={{
                mt: 1,
                color: 'custom.forestGreen',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Phone />
              <span>+{props.user.phone}</span>
            </Typography>
          )}

          {/* Email */}
          {props?.user?.email && (
            <Typography
              component="a"
              variant="body2"
              href={`mailto:${props.user.email}`}
              sx={{
                mt: 1,
                color: 'custom.forestGreen',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Mail />
              <span>{props.user.email}</span>
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
