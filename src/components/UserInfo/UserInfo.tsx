import Chat from '@green-world/components/Chat/Chat';
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
  Dialog,
  DialogContent
} from '@mui/material';
import {
  Camera,
  Globe,
  Mail,
  Phone,
  Store,
  MapPin,
  Settings,
  Milestone,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserInfo = ({ ...props }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const goToDestination = () => {
    const addressParts = [
      props?.user?.address?.street,
      props?.user?.address?.city,
      props?.user?.address?.country
    ].filter(Boolean);

    const destination = encodeURIComponent(addressParts.join(', '));

    return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  };

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
    <Card className={props?.customStyle}>
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
        <Box className={props?.customStyleMeta}>
          <Box
            className={props?.isUserProfile && 'cursor-pointer'}
            onClick={() => props?.isUserProfile && navigate('/Edit-image')}
          >
            <Avatar
              src={props?.user?.profileImage}
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
              href={props?.user?.website || '/'}
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
              href={goToDestination()}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="primary"
              startIcon={<Milestone />}
              sx={{ mt: 2, p: 1 }}
            >
              <Typography variant="body2" component="span">
                Navigacija
              </Typography>
            </Button>
          )}

          {!props?.isUserProfile && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MessageCircle />}
              sx={{ mt: 2, p: 1 }}
              onClick={() => setIsChatOpen(true)}
            >
              Kontaktiraj prodavca
            </Button>
          )}
        </Box>
      </CardContent>

      <Dialog
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Chat
            chatWithId={props?.user?._id}
            onClose={() => setIsChatOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
