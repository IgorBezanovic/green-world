'use client';

import { useDeleteEvent } from '@green-world/hooks/useDeleteEvent';
import {
  formatDate,
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import { slugOrId } from '@green-world/utils/slug';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  IconButton,
  Typography
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { DeleteConfirmDialog } from '../DeleteConfirmDialog';

export const EventProfileCard = ({ ...props }) => {
  const { t } = useTranslation();
  const { mutate, isPending: isDeletingEvent } = useDeleteEvent(
    props.event?._id
  );
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const plainText = getPlainTextFromHtml(props.event?.description);

  const handleCloseDeleteDialog = () => {
    if (isDeletingEvent) return;
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <Card
      sx={{
        maxHeight: !location.pathname.includes('/profile') ? 430 : 550,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        cursor: !location.pathname.includes('/profile') ? 'pointer' : 'default'
      }}
      onClick={() =>
        !location.pathname.includes('/profile') &&
        navigate(`/event/${slugOrId(props.event)}`)
      }
    >
      <Box
        sx={{ position: 'relative', display: 'inline-block', width: '100%' }}
      >
        <CardMedia
          component="img"
          height="194"
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '250px',
            aspectRatio: '1 / 1',
            objectFit: 'cover'
          }}
          image={formatImageUrl(props?.event?.coverImage, 55)}
          alt="Event Image"
        />
        <Chip
          label={
            props.event?.typeAction === 'cleaning'
              ? t('eventProfileCard.type.cleaning')
              : props.event?.typeAction === 'selling'
                ? t('eventProfileCard.type.selling')
                : props.event?.typeAction === 'planting'
                  ? t('eventProfileCard.type.planting')
                  : t('eventProfileCard.type.education')
          }
          color={
            props.event?.typeAction === 'cleaning'
              ? 'error'
              : props.event?.typeAction === 'selling'
                ? 'info'
                : props.event?.typeAction === 'planting'
                  ? 'success'
                  : 'secondary'
          }
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            paddingBottom: '8px'
          }}
        >
          <Tooltip title={props.event?.title} arrow>
            <Typography gutterBottom variant="h6" noWrap>
              {props.event?.title}
            </Typography>
          </Tooltip>
          <Divider variant="fullWidth" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              paddingTop: '8px'
            }}
          >
            <Typography
              gutterBottom
              variant="body2"
              sx={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
                minHeight: '3.0em'
              }}
            >
              {(plainText || '').trim().length === 0
                ? t('common.noDescription')
                : plainText.length > 50
                  ? plainText.substring(0, 50) + '...'
                  : plainText}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography
                variant="body2"
                component="span"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CalendarMonthIcon sx={{ fontSize: 18 }} />
                {formatDate(props.event?.dateAction)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <PlaceIcon sx={{ fontSize: 18 }} />
                {props.event?.place.length > 20
                  ? props.event?.place.substring(0, 20) + '...'
                  : props.event?.place}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Divider variant="fullWidth" />
        {location.pathname.includes('/profile') && (
          <CardActions disableSpacing sx={{ justifyContent: 'space-around' }}>
            <IconButton
              aria-label="add to favorites"
              onClick={() => navigate(`/edit-event/${slugOrId(props.event)}`)}
            >
              <EditIcon style={{ strokeWidth: '2px' }} />
            </IconButton>
            <IconButton
              aria-label="share"
              onClick={() => {
                navigator.clipboard
                  .writeText(
                    `https://www.zelenisvet.rs/event/${slugOrId(props.event)}`
                  )
                  .then(() => {
                    toast.success(t('eventProfileCard.linkCopied'));
                  })
                  .catch(() => {
                    alert(t('eventProfileCard.linkCopyFailed'));
                  });
              }}
            >
              <Copy style={{ strokeWidth: '2px' }} />
            </IconButton>

            <IconButton
              aria-label="Delete Event"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash style={{ strokeWidth: '2px' }} />
            </IconButton>
          </CardActions>
        )}
      </Box>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        title={t('eventProfileCard.deleteTitle')}
        description={t('eventProfileCard.deleteDescription')}
        cancelText={t('eventProfileCard.no')}
        confirmText={t('eventProfileCard.yes')}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingEvent}
      />
    </Card>
  );
};
