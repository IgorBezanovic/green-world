'use client';

import {
  formatDate,
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs, { type Dayjs } from 'dayjs';
import { Calendar, Clock3, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export type EventCardType = 'cleaning' | 'selling' | 'planting' | 'education';

const EVENT_TYPE_LABELS: Record<EventCardType, string> = {
  cleaning: 'Čišćenje',
  selling: 'Prodaja',
  planting: 'Sadnja',
  education: 'Edukacija'
};

const EVENT_TYPE_COLORS: Record<
  EventCardType,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  cleaning: 'success',
  selling: 'info',
  planting: 'warning',
  education: 'secondary'
};

const EVENT_TYPE_BADGE_SX: Record<
  EventCardType,
  { bgcolor: string; color: string }
> = {
  cleaning: { bgcolor: 'success.light', color: 'success.dark' },
  selling: { bgcolor: 'info.light', color: 'info.dark' },
  planting: { bgcolor: 'warning.light', color: 'warning.dark' },
  education: { bgcolor: 'secondary.light', color: 'secondary.dark' }
};

export const isEventFinished = (event: EventCardProps): boolean => {
  const status = String(event.status || '').toLowerCase();
  if (['finished', 'ended', 'completed', 'done', 'inactive'].includes(status)) {
    return true;
  }
  const eventDate = dayjs(event.dateAction as string | Date | undefined);
  if (!eventDate.isValid()) return false;
  if (event.endTime) {
    const [hours, minutes] = event.endTime.split(':').map(Number);
    const eventEnd = eventDate
      .hour(hours || 0)
      .minute(minutes || 0)
      .second(0);
    return eventEnd.isBefore(dayjs());
  }
  return eventDate.endOf('day').isBefore(dayjs());
};

export interface EventCardProps {
  _id?: string;
  title: string;
  description?: string;
  place?: string;
  coverImage: string;
  dateAction?: Dayjs | string | Date | null;
  startTime?: string;
  endTime?: string;
  typeAction: EventCardType;
  contactPerson?: string;
  status?: string;
}

export const EventCard = ({ event }: { event: EventCardProps }) => {
  const isFinished = isEventFinished(event);
  const formattedDate = formatDate(event.dateAction);
  const hasValidDate =
    Boolean(formattedDate) && !formattedDate.toLowerCase().includes('nan');
  const organizerName = event.contactPerson?.trim() || 'Organizator';

  return (
    <Card
      component={Link}
      to={`/event/${event._id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minWidth: 0,
        textDecoration: 'none',
        opacity: isFinished ? 0.65 : 1,
        filter: isFinished ? 'grayscale(0.3)' : 'none',
        transition: 'all 0.2s ease'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 220,
          minHeight: 220,
          bgcolor: 'grey.100',
          overflow: 'hidden'
        }}
      >
        <Box
          component="img"
          src={formatImageUrl(event?.coverImage, 85)}
          alt={event.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />

        <Chip
          label={EVENT_TYPE_LABELS[event.typeAction]}
          color={EVENT_TYPE_COLORS[event.typeAction]}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 700,
            bgcolor: EVENT_TYPE_BADGE_SX[event.typeAction].bgcolor,
            color: EVENT_TYPE_BADGE_SX[event.typeAction].color,
            border: 'none',
            '& .MuiChip-label': { px: 1.25 }
          }}
        />

        <Chip
          label={event.place || 'Lokacija nije uneta'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            maxWidth: '50%',
            fontWeight: 700,
            bgcolor: '#e2bd9d',
            color: '#4a2b17',
            border: 'none',
            '& .MuiChip-label': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block'
            }
          }}
        />

        {isFinished && (
          <Box
            sx={{
              position: 'absolute',
              top: 18,
              right: -48,
              width: 180,
              textAlign: 'center',
              transform: 'rotate(45deg)',
              bgcolor: 'primary.main',
              color: 'common.white',
              py: 0.5,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: 0.6,
              boxShadow: 2,
              textTransform: 'uppercase'
            }}
          >
            Završeno
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          pb: 2,
          '&:last-child': { pb: 2 }
        }}
      >
        <Tooltip title={event.title} arrow>
          <Typography
            variant="h3"
            component="h2"
            fontWeight={500}
            sx={{
              color: 'text.primary',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              minHeight: '1.4em'
            }}
          >
            {event.title}
          </Typography>
        </Tooltip>
        <Divider variant="fullWidth" />
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5rem',
            paddingTop: '8px'
          }}
        >
          {event.description ? getPlainTextFromHtml(event.description) : ''}
        </Typography>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ borderTop: '1px solid #f0f0f0', mb: 1.5 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
              minWidth: 0
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                minWidth: 0,
                color: 'text.secondary'
              }}
            >
              {hasValidDate ? (
                <>
                  <Calendar size={14} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}
                  >
                    {formattedDate}
                  </Typography>
                </>
              ) : (
                <>
                  <User size={14} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}
                  >
                    {organizerName}
                  </Typography>
                </>
              )}
            </Box>
            {(event.startTime || event.endTime) && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  minWidth: 0,
                  color: 'text.secondary'
                }}
              >
                <Clock3 size={14} />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ whiteSpace: 'nowrap', fontSize: '0.72rem' }}
                >
                  {event.startTime}
                  {event.endTime ? ` - ${event.endTime}` : ''}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
