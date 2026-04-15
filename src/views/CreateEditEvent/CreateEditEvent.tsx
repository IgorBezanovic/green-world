'use client';

import {
  AppBreadcrumbs,
  PageContent,
  PageLoader,
  PageTitle
} from '@green-world/components';
import { useCreateEvent } from '@green-world/hooks/useCreateEvent';
import { useEditEvent } from '@green-world/hooks/useEditEvent';
import { useEvent } from '@green-world/hooks/useEvent';
import { useImage } from '@green-world/hooks/useImage';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Event } from '@green-world/utils/types';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-quill-new/dist/quill.snow.css';
import { useParams } from 'react-router';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const initEvent: Event = {
  title: '',
  description: '',
  place: '',
  address: '',
  coverImage: '',
  dateAction: dayjs().add(24, 'hour'),
  startTime: '',
  endTime: '',
  typeAction: 'cleaning',
  contactPerson: '',
  contactPhone: '',
  contactMail: '',
  status: 'active'
};

export const CreateEditEvent = () => {
  const { t } = useTranslation();
  const { eventID = '' } = useParams();
  const { data = initEvent, isLoading } = useEvent(eventID);

  const modules = {
    toolbar: [
      { header: [false, '1', '2', '3', '4', '5', '6'] },
      { font: [] },
      { color: [] },
      { background: [] },
      { list: 'ordered' },
      { list: 'bullet' },
      { align: [] },
      'bold',
      'italic',
      'underline',
      'strike',
      'link',
      'image',
      'video',
      'blockquote',
      { script: 'sub' },
      { script: 'super' }
    ]
  };

  const {
    mutate: imageMutate,
    isPending: isImageLoading,
    data: eventImage
  } = useImage();

  const { mutate: createMutation, isPending: isLoadingCreateEvent } =
    useCreateEvent();

  const { mutate: editMutation, isPending: isLoadingEditEvent } =
    useEditEvent(eventID);

  const [event, setEvent] = useState<Event>(initEvent);

  useEffect(() => {
    if (!isLoading) {
      setEvent(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (eventImage) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        coverImage: eventImage
      }));
    }
  }, [eventImage]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const file = Array.from(e.target.files!)[0];

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEvent({ ...event, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    eventID ? editMutation(event) : createMutation(event);
  };

  const handleRichTextDescription = (richText: string) => {
    setEvent((prevEvent) => ({
      ...prevEvent,
      description: richText
    }));
  };

  const outlinedInputSx = {
    mb: 2,
    bgcolor: 'background.default',
    '& .MuiOutlinedInput-input': {
      p: '12px'
    }
  };

  const labelSx = {
    mb: 1,
    color: 'secondary.main',
    cursor: 'pointer',
    fontSize: '1.125rem'
  };

  const outlinedSelectSx = {
    mb: 2,
    bgcolor: 'background.default',
    minHeight: '42px'
  };

  const handleTypeActionChange = (e: SelectChangeEvent<string>) => {
    setEvent({ ...event, typeAction: e.target.value as Event['typeAction'] });
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setEvent({ ...event, status: e.target.value as Event['status'] });
  };

  const validationErrors: string[] = [];
  if (!event.title.trim())
    validationErrors.push(t('createEditEvent.validation.titleRequired'));
  if (!(event.typeAction ?? '').trim())
    validationErrors.push(t('createEditEvent.validation.typeRequired'));
  if (!event.place.trim())
    validationErrors.push(t('createEditEvent.validation.placeRequired'));
  if (!event.startTime.trim())
    validationErrors.push(t('createEditEvent.validation.startTimeRequired'));
  if (!(event.status ?? '').trim())
    validationErrors.push(t('createEditEvent.validation.statusRequired'));

  const isFormValid = validationErrors.length === 0;

  if (isLoading) {
    return <PageLoader />;
  }

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    {
      label: eventID
        ? t('createEditEvent.breadcrumbEdit')
        : t('createEditEvent.breadcrumbCreate'),
      route: `/${eventID ? 'edit' : 'create'}-event`
    }
  ];

  return (
    <PageContent>
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
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <PageTitle>
          {eventID
            ? t('createEditEvent.headingEdit')
            : t('createEditEvent.headingCreate')}
        </PageTitle>
        <Box
          component="form"
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              gap: 5
            }
          })}
          onSubmit={handleSubmit}
        >
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="title" component="label" sx={labelSx}>
              {t('createEditEvent.fields.titleLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="title"
              id="title"
              placeholder={t('createEditEvent.fields.titlePlaceholder')}
              value={event?.title || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.titleHint')}
            </Typography>
            <Typography htmlFor="typeAction" component="label" sx={labelSx}>
              {t('createEditEvent.fields.typeLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <FormControl fullWidth>
              <Select
                name="typeAction"
                displayEmpty
                id="typeAction"
                value={event?.typeAction || ''}
                onChange={handleTypeActionChange}
                sx={{ ...outlinedSelectSx, mb: 0.5 }}
              >
                <MenuItem value="" disabled>
                  {t('createEditEvent.fields.typePlaceholder')}
                </MenuItem>
                <MenuItem value="cleaning">
                  {t('eventCard.type.cleaning')}
                </MenuItem>
                <MenuItem value="selling">
                  {t('eventCard.type.selling')}
                </MenuItem>
                <MenuItem value="planting">
                  {t('eventCard.type.planting')}
                </MenuItem>
                <MenuItem value="education">
                  {t('eventCard.type.education')}
                </MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.typeHint')}
            </Typography>
            <Typography htmlFor="contactPerson" component="label" sx={labelSx}>
              {t('createEditEvent.fields.contactPersonLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="contactPerson"
              id="contactPerson"
              placeholder={t('createEditEvent.fields.contactPersonPlaceholder')}
              value={event?.contactPerson || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.contactPersonHint')}
            </Typography>
            <Typography htmlFor="place" component="label" sx={labelSx}>
              {t('createEditEvent.fields.placeLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="place"
              id="place"
              placeholder={t('createEditEvent.fields.placePlaceholder')}
              value={event?.place || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.placeHint')}
            </Typography>
            <Typography htmlFor="address" component="label" sx={labelSx}>
              {t('createEditEvent.fields.addressLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="address"
              id="address"
              placeholder={t('createEditEvent.fields.addressPlaceholder')}
              value={event?.address || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.addressHint')}
            </Typography>
            <Typography
              htmlFor="coverImage"
              component="label"
              sx={{ ...labelSx, mb: 1 }}
            >
              {t('createEditEvent.fields.imageLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <Box
              sx={{
                height: 150,
                width: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: 2,
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {isImageLoading ? (
                <CircularProgress color="success" />
              ) : event?.coverImage ? (
                <img
                  src={formatImageUrl(event?.coverImage)}
                  alt="event-image"
                  style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                  height="100%"
                  width="100%"
                />
              ) : (
                <Box
                  component="label"
                  htmlFor="coverImage"
                  sx={{ cursor: 'pointer' }}
                >
                  <AddPhotoAlternateIcon
                    sx={{ width: '100px', height: '100px', color: 'gray' }}
                  />
                </Box>
              )}
            </Box>
            <Button
              component="label"
              variant="outlined"
              color="primary"
              sx={(theme) => ({
                py: 1,
                px: 2,
                boxShadow: 2,
                textAlign: 'center',
                mx: 'auto',
                textTransform: 'uppercase',
                fontWeight: 300,
                mb: 2,
                transition: 'all 300ms ease',
                [theme.breakpoints.up('md')]: {
                  mx: 0,
                  mb: 0,
                  '&:hover': {
                    color: 'common.black',
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: 2
                  }
                }
              })}
            >
              {t('createEditEvent.fields.addImage')}
              <Box
                component="input"
                type="file"
                name="coverImage"
                id="coverImage"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImage}
                sx={{ display: 'none' }}
              />
            </Button>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('createEditEvent.fields.imageHint')}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="description" component="label" sx={labelSx}>
              {t('createEditEvent.fields.descriptionLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <Box sx={{ mb: 0.5 }}>
              <ReactQuill
                modules={modules}
                value={event?.description || ''}
                onChange={handleRichTextDescription}
                id="description"
                theme="snow"
              />
              <style>
                {`
                .ql-toolbar.ql-snow{
                  border-top-left-radius: 0.375rem;
                  border-top-right-radius: 0.375rem;
                  /* Remove shadow below the bottom border */
                  box-shadow: 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
                  border-color: rgb(38 96 65) !important;
                }
                .ql-container {
                  min-height: 200px !important;
                  border-bottom-left-radius: 0.375rem;
                  border-bottom-right-radius: 0.375rem;
                  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
                  border-color: rgb(38 96 65) !important;
                }
                .ql-editor {
                  word-break: break-word;
                  overflow-wrap: break-word;
                }
                `}
              </style>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.descriptionHint')}
            </Typography>
            <Typography htmlFor="dateAction" component="label" sx={labelSx}>
              {t('createEditEvent.fields.dateLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <MobileDatePicker
              name="dateAction"
              value={dayjs(event?.dateAction, 'DD/MM/YYYY')}
              format="DD/MM/YYYY"
              minDate={dayjs().add(24, 'hour')}
              onChange={(newDate) =>
                setEvent({
                  ...event,
                  dateAction: dayjs(newDate).format('DD/MM/YYYY')
                })
              }
              sx={(theme) => ({
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)'
                },
                marginBottom: '4px',
                '& .MuiPickersSectionList-root': {
                  padding: '10px 0',
                  borderColor: theme.palette.secondary.main
                }
              })}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.dateHint')}
            </Typography>
            <Typography htmlFor="startTime" component="label" sx={labelSx}>
              {t('createEditEvent.fields.startTimeLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="startTime"
              id="startTime"
              placeholder={t('createEditEvent.fields.startTimePlaceholder')}
              value={event?.startTime || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.startTimeHint')}
            </Typography>
            <Typography htmlFor="endTime" component="label" sx={labelSx}>
              {t('createEditEvent.fields.endTimeLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="endTime"
              id="endTime"
              placeholder={t('createEditEvent.fields.endTimePlaceholder')}
              value={event?.endTime || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.endTimeHint')}
            </Typography>
            <Typography htmlFor="contactPhone" component="label" sx={labelSx}>
              {t('createEditEvent.fields.contactPhoneLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="contactPhone"
              placeholder={t('createEditEvent.fields.contactPhonePlaceholder')}
              value={event?.contactPhone || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.contactPhoneHint')}
            </Typography>
            <Typography htmlFor="contactMail" component="label" sx={labelSx}>
              {t('createEditEvent.fields.contactMailLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="contactMail"
              id="contactMail"
              placeholder={t('createEditEvent.fields.contactMailPlaceholder')}
              value={event?.contactMail || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={{ ...outlinedInputSx, mb: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.contactMailHint')}
            </Typography>
            <Typography htmlFor="status" component="label" sx={labelSx}>
              {t('createEditEvent.fields.statusLabel')}{' '}
              <Box component="span" sx={{ color: 'error.main' }}>
                *
              </Box>
            </Typography>
            <FormControl fullWidth>
              <Select
                required
                name="status"
                displayEmpty
                id="status"
                value={event?.status || ''}
                onChange={handleStatusChange}
                sx={{ ...outlinedSelectSx, mb: 0.5 }}
              >
                <MenuItem value="" disabled>
                  {t('createEditEvent.fields.statusPlaceholder')}
                </MenuItem>
                <MenuItem value="active">
                  {t('createEditEvent.status.active')}
                </MenuItem>
                <MenuItem value="cancelled">
                  {t('createEditEvent.status.cancelled')}
                </MenuItem>
                <MenuItem value="finished">
                  {t('createEditEvent.status.finished')}
                </MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('createEditEvent.fields.statusHint')}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            pt: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            [theme.breakpoints.up('md')]: {
              alignItems: 'flex-end'
            }
          })}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ alignSelf: 'flex-start' }}
          >
            <Box component="span" sx={{ color: 'error.main', mr: 0.5 }}>
              *
            </Box>
            {t('createEditEvent.requiredFieldsLegend')}
          </Typography>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            disabled={
              !isFormValid || isLoadingCreateEvent || isLoadingEditEvent
            }
          >
            {isLoadingCreateEvent || isLoadingEditEvent ? (
              <CircularProgress
                size={20}
                sx={{ color: 'primary.main', my: 1 }}
              />
            ) : eventID ? (
              t('createEditEvent.submitEdit')
            ) : (
              t('createEditEvent.submitCreate')
            )}
          </Button>
        </Box>
      </Box>
    </PageContent>
  );
};
