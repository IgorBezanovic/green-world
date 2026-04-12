'use client';

import {
  AppBreadcrumbs,
  BookmarkButton,
  CommentForm,
  CommentList,
  CopyLinkButton,
  PageContent,
  VoteButtons,
  DeletedItemOverlay
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { useCreateEventComment } from '@green-world/hooks/useCreateEventComment';
import { useEvent } from '@green-world/hooks/useEvent';
import { useUser } from '@green-world/hooks/useUser';
import { useVoteEvent } from '@green-world/hooks/useVoteEvent';
import {
  formatDate,
  formatImageUrl,
  getHtmlDescriptionProps
} from '@green-world/utils/helpers';
import type { Event as EventData } from '@green-world/utils/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, Clock, Eye, Mail, MapPin, Phone, User } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

type EventTypeAction = 'cleaning' | 'selling' | 'planting';
type EventStatus = 'active' | 'cancelled' | 'finished';

const EVENT_TYPE_COLORS: Record<
  EventTypeAction,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  cleaning: 'success',
  selling: 'info',
  planting: 'warning'
};

const EVENT_STATUS_COLORS: Record<
  EventStatus,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  active: 'success',
  cancelled: 'error',
  finished: 'default'
};

export const Event = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { data: eventData, isLoading, refetch } = useEvent(eventId!);
  const { data: creatorData, isLoading: creatorLoading } = useUser(
    eventData?.createdBy || ''
  );
  const { mutate: voteMutate } = useVoteEvent(eventId || '');
  const { mutate: createComment } = useCreateEventComment();
  const { user } = useContext(UserContext);

  const handleEventVote = (vote: 'like' | 'dislike' | string) => {
    if (!eventId) return;

    voteMutate(
      { vote },
      {
        onSuccess: () => {
          refetch();
        }
      }
    );
  };

  const handleAddComment = (text: string, parentComment?: string | null) => {
    if (!eventId) return;

    const author =
      `${user?.name || ''} ${user?.lastname || ''}`.trim() ||
      t('common.unknownUser');

    try {
      createComment({ actionId: eventId, text, parentComment, author });
      refetch();
    } catch (e) {
      console.error('Create event comment failed', e);
    }
  };

  if (!eventId) return null;

  const isEventFinished = (event?: EventData | null) => {
    if (!event) return false;

    const eventDate = dayjs(event.dateAction as string | Date | undefined);

    // User requirement: never show finished if date is invalid.
    if (!eventDate.isValid()) return false;

    const status = String(event.status || '').toLowerCase();
    if (
      ['finished', 'ended', 'completed', 'done', 'inactive'].includes(status)
    ) {
      return true;
    }

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

  const eventDate = dayjs(eventData?.dateAction as string | Date | undefined);
  const isEventDateValid = eventDate.isValid();
  const hasFinishedRibbon = isEventFinished(eventData);
  const backendStatus = (eventData?.status as EventStatus) ?? 'active';
  const effectiveStatus: EventStatus = hasFinishedRibbon
    ? 'finished'
    : backendStatus === 'finished'
      ? 'active'
      : backendStatus;

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.events'), route: '/events' },
    {
      label: eventData?.title || t('eventPage.eventFallback'),
      route: `/event/${eventId}`
    }
  ];

  return (
    <PageContent>
      {(eventData as any)?.status === 'deleted' && (
        <DeletedItemOverlay
          itemType="dogadjaj"
          creatorId={eventData?.createdBy as string | undefined}
          creatorNotFound={!creatorLoading && !creatorData}
        />
      )}
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          [theme.breakpoints.up('sm')]: { px: '1.5rem' },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider />

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 3 }}
            />
            <Skeleton variant="text" height={48} width="60%" />
            <Skeleton variant="text" height={28} width="30%" />
            <Skeleton
              variant="rectangular"
              height={100}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        ) : eventData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {/* ── Hero: image + info ── */}
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                [theme.breakpoints.up('md')]: { flexDirection: 'row' }
              })}
            >
              {/* Cover image */}
              <Box
                sx={(theme) => ({
                  width: '100%',
                  flexShrink: 0,
                  [theme.breakpoints.up('md')]: { width: '45%' }
                })}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'grey.100'
                  }}
                >
                  <Box
                    component="img"
                    src={formatImageUrl(eventData.coverImage, 85)}
                    alt={eventData.title}
                    sx={{
                      width: '100%',
                      aspectRatio: '4 / 3',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: hasFinishedRibbon ? 0.68 : 1,
                      filter: hasFinishedRibbon
                        ? 'grayscale(0.35) brightness(1.05)'
                        : 'none',
                      transition: 'opacity 0.2s ease, filter 0.2s ease'
                    }}
                  />

                  {hasFinishedRibbon && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 28,
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
                        textTransform: 'uppercase',
                        zIndex: 2
                      }}
                    >
                      {t('eventCard.finished')}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Info panel */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  minWidth: 0
                }}
              >
                {/* Type + Status chips */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    label={t(
                      `eventCard.type.${eventData.typeAction as EventTypeAction}`
                    )}
                    color={
                      EVENT_TYPE_COLORS[
                        eventData.typeAction as EventTypeAction
                      ] ?? 'default'
                    }
                    size="small"
                  />
                  <Chip
                    label={t(`eventPage.status.${effectiveStatus}`)}
                    color={EVENT_STATUS_COLORS[effectiveStatus] ?? 'default'}
                    size="small"
                    variant="outlined"
                  />
                </Stack>

                {/* Title */}
                <Typography
                  variant="h1"
                  sx={(theme) => ({
                    fontFamily: 'var(--font-ephesis, Ephesis), cursive',
                    fontWeight: 400,
                    fontSize: '2.5rem',
                    [theme.breakpoints.up('md')]: {
                      fontSize: '3rem'
                    },
                    color: 'secondary.main',
                    lineHeight: 1.2,
                    mb: 1
                  })}
                >
                  {eventData.title}
                </Typography>

                {/* Metadata */}
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Calendar size={18} strokeWidth={1.75} />
                    {isEventDateValid ? (
                      <Typography>
                        {formatDate(eventData.dateAction)}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" fontStyle="italic">
                        {t('eventPage.noDateInfo')}
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Clock size={18} strokeWidth={1.75} />
                    <Typography>
                      {eventData.startTime}
                      {eventData.endTime ? ` – ${eventData.endTime}` : ''}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <MapPin
                      size={18}
                      strokeWidth={1.75}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <Typography>
                      {eventData.place}
                      {eventData.address ? `, ${eventData.address}` : ''}
                    </Typography>
                  </Stack>

                  {(eventData.viewCounter ?? 0) > 0 && (
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Eye size={18} strokeWidth={1.75} />
                      <Typography variant="body2" color="text.secondary">
                        {t('eventPage.views', {
                          count: eventData.viewCounter
                        })}
                      </Typography>
                    </Stack>
                  )}
                </Stack>

                {/* Contact CTA */}
                {(eventData.contactPhone || eventData.contactMail) && (
                  <Box>
                    {eventData.contactPhone ? (
                      <Button
                        component="a"
                        href={`tel:${eventData.contactPhone}`}
                        variant="contained"
                        color="primary"
                        startIcon={<Phone color="white" />}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        {eventData.contactPhone}
                      </Button>
                    ) : (
                      <Button
                        component="a"
                        href={`mailto:${eventData.contactMail}`}
                        variant="contained"
                        color="primary"
                        startIcon={<Mail color="white" />}
                        sx={{ textTransform: 'none', borderRadius: 1.5 }}
                      >
                        {t('eventPage.contactOrganizer')}
                      </Button>
                    )}
                  </Box>
                )}

                <Divider />

                {/* Contact card */}
                {(eventData.contactPerson ||
                  eventData.contactPhone ||
                  eventData.contactMail) && (
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ pb: '16px !important' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        mb={1.5}
                      >
                        {t('eventPage.contact')}
                      </Typography>
                      <Stack spacing={1.5}>
                        {eventData.contactPerson && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{
                              cursor: eventData.createdBy
                                ? 'pointer'
                                : 'default',
                              '&:hover': eventData.createdBy
                                ? { color: 'primary.main' }
                                : {}
                            }}
                            onClick={() =>
                              eventData.createdBy &&
                              navigate(`/shop/${eventData.createdBy}`)
                            }
                          >
                            <User size={18} strokeWidth={1.75} />
                            <Typography>{eventData.contactPerson}</Typography>
                          </Stack>
                        )}

                        {eventData.contactPhone && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Phone size={18} strokeWidth={1.75} />
                            <Typography
                              component="a"
                              href={`tel:${eventData.contactPhone}`}
                              sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {eventData.contactPhone}
                            </Typography>
                          </Stack>
                        )}

                        {eventData.contactMail && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Mail size={18} strokeWidth={1.75} />
                            <Typography
                              component="a"
                              href={`mailto:${eventData.contactMail}`}
                              sx={{
                                textDecoration: 'none',
                                color: 'inherit',
                                '&:hover': { color: 'primary.main' }
                              }}
                            >
                              {eventData.contactMail}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Box>

            <Box
              sx={(theme) => ({
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: 1.25,
                [theme.breakpoints.up('sm')]: {
                  alignItems: 'center',
                  flexDirection: 'row'
                }
              })}
            >
              <VoteButtons
                likes={eventData.likes}
                dislikes={eventData.dislikes}
                onVote={handleEventVote}
              />
              <CopyLinkButton
                successMessage={t('eventPage.linkCopied')}
                errorMessage={t('eventPage.linkCopyFailed')}
              />
              <BookmarkButton />
            </Box>

            {/* ── Description ── */}
            <Box>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {t('eventPage.description')}
              </Typography>
              <Box {...getHtmlDescriptionProps(eventData.description)} />
            </Box>

            {/* ── Comments ── */}
            <Card sx={{ mt: 2, p: 2 }}>
              <Typography
                variant="h4"
                sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.75 }}
              >
                {t('blogPostPage.leaveComment')}
              </Typography>
              <CommentForm onSubmit={handleAddComment} />
              <CommentList
                comments={eventData?.comments || []}
                onReply={handleAddComment}
              />
            </Card>
          </Box>
        ) : null}
      </Box>
    </PageContent>
  );
};
