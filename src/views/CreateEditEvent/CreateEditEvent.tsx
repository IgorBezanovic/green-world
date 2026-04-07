'use client';

import {
  AppBreadcrumbs,
  PageContent,
  PageLoader
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
  dateAction: dayjs(),
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
    <PageContent sx={{ backgroundColor: 'background.paper' }}>
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Typography
          component="h1"
          sx={(theme) => ({
            color: 'primary.main',
            fontSize: '3rem',
            [theme.breakpoints.up('md')]: { fontSize: '3.75rem' },
            fontFamily: 'Ephesis',
            mx: 'auto',
            lineHeight: 1
          })}
        >
          {eventID
            ? t('createEditEvent.headingEdit')
            : t('createEditEvent.headingCreate')}
        </Typography>
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
              {t('createEditEvent.fields.titleLabel')}
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
              sx={outlinedInputSx}
            />
            <Typography htmlFor="typeAction" component="label" sx={labelSx}>
              {t('createEditEvent.fields.typeLabel')}
            </Typography>
            <FormControl fullWidth>
              <Select
                name="typeAction"
                displayEmpty
                id="typeAction"
                value={event?.typeAction || ''}
                onChange={handleTypeActionChange}
                sx={outlinedSelectSx}
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
              </Select>
            </FormControl>
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
              sx={outlinedInputSx}
            />
            <Typography htmlFor="place" component="label" sx={labelSx}>
              {t('createEditEvent.fields.placeLabel')}
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
              sx={outlinedInputSx}
            />
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
              sx={outlinedInputSx}
            />
            <Typography
              htmlFor="coverImage"
              component="label"
              sx={{ ...labelSx, mb: 1 }}
            >
              {t('createEditEvent.fields.imageLabel')}
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
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="description" component="label" sx={labelSx}>
              {t('createEditEvent.fields.descriptionLabel')}
            </Typography>
            <Box sx={{ mb: 2 }}>
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
            <Typography htmlFor="dateAction" component="label" sx={labelSx}>
              {t('createEditEvent.fields.dateLabel')}
            </Typography>
            <MobileDatePicker
              name="dateAction"
              value={dayjs(event?.dateAction, 'DD/MM/YYYY')}
              format="DD/MM/YYYY"
              minDate={dayjs()}
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
                marginBottom: '16px',
                '& .MuiPickersSectionList-root': {
                  padding: '10px 0',
                  borderColor: theme.palette.secondary.main
                }
              })}
            />
            <Typography htmlFor="startTime" component="label" sx={labelSx}>
              {t('createEditEvent.fields.startTimeLabel')}
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
              sx={outlinedInputSx}
            />
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
              sx={outlinedInputSx}
            />
            <Typography htmlFor="contactPhone" component="label" sx={labelSx}>
              {t('createEditEvent.fields.contactPhoneLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="contactPhone"
              placeholder="+381 60 123 456 7"
              value={event?.contactPhone || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
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
              sx={outlinedInputSx}
            />
            <Typography htmlFor="status" component="label" sx={labelSx}>
              {t('createEditEvent.fields.statusLabel')}
            </Typography>
            <FormControl fullWidth>
              <Select
                required
                name="status"
                displayEmpty
                id="status"
                value={event?.status || ''}
                onChange={handleStatusChange}
                sx={outlinedSelectSx}
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
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              sx={{ mt: 4 }}
              disabled={isLoadingCreateEvent || isLoadingEditEvent}
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
      </Box>
    </PageContent>
  );
};
