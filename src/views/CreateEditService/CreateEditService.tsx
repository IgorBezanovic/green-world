'use client';

import {
  AppBreadcrumbs,
  PageContent,
  PageLoader
} from '@green-world/components';
import { useDeleteImage } from '@green-world/hooks/useDeleteImage';
import { useImage } from '@green-world/hooks/useImage';
import {
  useCreateServiceListing,
  useGetServiceById,
  useUpdateServiceListing
} from '@green-world/hooks/useServices';
import {
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import { serviceCategories } from '@green-world/utils/serviceConstants';
import { ServiceListing } from '@green-world/utils/types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Typography,
  Chip,
  SelectChangeEvent,
  TextField,
  Select
} from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const initServiceListing: Partial<ServiceListing> = {
  title: '',
  description: '',
  services: [],
  images: [],
  priceType: 'fixed',
  priceFrom: undefined,
  priceTo: undefined,
  location: '',
  serviceRadiusKm: undefined,
  experienceYears: undefined,
  equipment: [],
  languages: [],
  availability: [],
  videoUrl: '',
  portfolioLinks: []
};

const MAX_IMAGE_MB = 10 * 1024 * 1024;
const PREDEFINED_SERVICE_LANGUAGES = [
  'Srpski',
  'English',
  'Русский',
  'Deutsch',
  'Français',
  'Italiano',
  'Español',
  'Magyar'
];

export const CreateEditService = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { serviceId = '' } = useParams();

  const { data: serviceResponse, isLoading: isLoadingService } =
    useGetServiceById(serviceId);
  const existingService = serviceResponse;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
      'blockquote'
    ]
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const { mutateAsync: uploadImage, isPending: isImageLoading } = useImage();

  const { mutate: createMutation, isPending: isLoadingCreate } =
    useCreateServiceListing();
  const { mutate: editMutation, isPending: isLoadingEdit } =
    useUpdateServiceListing();
  const { mutate: deleteImageMutate } = useDeleteImage();

  const [serviceData, setServiceData] =
    useState<Partial<ServiceListing>>(initServiceListing);

  const flatServicesList = useMemo(() => {
    return Object.values(serviceCategories).flatMap(
      (category) => category.services
    );
  }, []);

  useEffect(() => {
    if (!isLoadingService && existingService) {
      setServiceData({
        ...existingService,
        description: existingService.description || ''
      });
    }
  }, [existingService, isLoadingService]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = '';

    if (!selectedFiles.length) return;

    const existingCount = serviceData.images?.length || 0;
    const remainingSlots = Math.max(0, 10 - existingCount);
    if (remainingSlots === 0) return;

    const filesToUpload = selectedFiles.slice(0, remainingSlots);

    for (const file of filesToUpload) {
      if (file.size > MAX_IMAGE_MB) {
        setSnackbarOpen(true);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const imageUrl = await uploadImage(formData);
        setServiceData((prev) => ({
          ...prev,
          images: [...(prev.images || []), imageUrl]
        }));
      } catch {
        // Keep processing remaining files even if one upload fails.
      }
    }
  };

  const handleDeleteImage = (indexToDelete: number) => {
    if (!serviceData.images) return;

    const deletedImage = serviceData.images[indexToDelete];
    const updatedImages = serviceData.images.filter(
      (_, index) => index !== indexToDelete
    );

    if (deletedImage) {
      deleteImageMutate(deletedImage);
    }

    setServiceData((prev) => ({
      ...prev,
      images: updatedImages
    }));
  };

  const handleSetAsProfileImage = (index: number) => {
    if (!serviceData.images || index === 0) return;

    setServiceData((prev) => {
      if (!prev.images) return prev;
      const updatedImages = [...prev.images];
      const selectedImage = updatedImages.splice(index, 1)[0];
      updatedImages.unshift(selectedImage);
      return {
        ...prev,
        images: updatedImages
      };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData({ ...serviceData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setServiceData({ ...serviceData, [name!]: value });
  };

  const handleRichTextDescription = (richText: string) => {
    setServiceData((prev) => ({
      ...prev,
      description: richText
    }));
  };

  const handleAddPortfolioLink = () => {
    setServiceData((prev) => ({
      ...prev,
      portfolioLinks: [...(prev.portfolioLinks || []), { label: '', url: '' }]
    }));
  };

  const handleRemovePortfolioLink = (index: number) => {
    setServiceData((prev) => {
      const links = prev.portfolioLinks ? [...prev.portfolioLinks] : [];
      links.splice(index, 1);
      return { ...prev, portfolioLinks: links };
    });
  };

  const handlePortfolioLinkChange = (
    index: number,
    field: 'label' | 'url',
    value: string
  ) => {
    setServiceData((prev) => {
      const links = prev.portfolioLinks ? [...prev.portfolioLinks] : [];
      if (links[index]) {
        links[index][field] = value;
      }
      return { ...prev, portfolioLinks: links };
    });
  };

  const normalizeStringArray = (values?: string[]) => {
    if (!values || values.length === 0) return [];

    const uniqueValues = new Set(
      values.map((value) => value.trim()).filter(Boolean)
    );

    return Array.from(uniqueValues);
  };

  const handleArrayFieldChange = (
    field: 'equipment' | 'languages' | 'availability',
    values: string[]
  ) => {
    setServiceData((prev) => ({
      ...prev,
      [field]: normalizeStringArray(values)
    }));
  };

  const languageOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...PREDEFINED_SERVICE_LANGUAGES,
          ...(serviceData.languages || [])
        ])
      ),
    [serviceData.languages]
  );

  const isValidUrl = (url: string) => {
    if (!url) return true; // empty is handled by required check
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isPortfolioLinksValid = useMemo(() => {
    if (!serviceData.portfolioLinks || serviceData.portfolioLinks.length === 0)
      return true;
    return serviceData.portfolioLinks.every(
      (link) =>
        link.label.trim() !== '' &&
        link.url.trim() !== '' &&
        isValidUrl(link.url)
    );
  }, [serviceData.portfolioLinks]);

  const canAddNewPortfolioLink = useMemo(() => {
    if (!serviceData.portfolioLinks || serviceData.portfolioLinks.length === 0)
      return true;
    const lastLink =
      serviceData.portfolioLinks[serviceData.portfolioLinks.length - 1];
    return (
      lastLink.label.trim() !== '' &&
      lastLink.url.trim() !== '' &&
      isValidUrl(lastLink.url)
    );
  }, [serviceData.portfolioLinks]);

  const hasPriceFrom =
    serviceData.priceFrom !== undefined &&
    serviceData.priceFrom !== null &&
    String(serviceData.priceFrom).trim() !== '';
  const hasPriceTo =
    serviceData.priceTo !== undefined &&
    serviceData.priceTo !== null &&
    String(serviceData.priceTo).trim() !== '';
  const parsedPriceFrom = hasPriceFrom ? Number(serviceData.priceFrom) : NaN;
  const parsedPriceTo = hasPriceTo ? Number(serviceData.priceTo) : NaN;
  const hasRequiredTitle = Boolean(serviceData.title?.trim());
  const hasRequiredDescription = Boolean(
    getPlainTextFromHtml(serviceData.description || '').trim()
  );
  const hasRequiredServices = Boolean(
    serviceData.services && serviceData.services.length > 0
  );
  const trimmedLocation = (serviceData.location || '').trim();
  const isLocationInvalid =
    Boolean(trimmedLocation) && !/\p{L}/u.test(trimmedLocation);
  const hasRequiredPriceType = Boolean(serviceData.priceType);
  const hasRequiredPriceFrom =
    serviceData.priceType === 'negotiable'
      ? true
      : hasPriceFrom &&
        Number.isFinite(parsedPriceFrom) &&
        parsedPriceFrom >= 0;
  const isPriceRangeInvalid =
    serviceData.priceType !== 'negotiable' &&
    hasPriceFrom &&
    hasPriceTo &&
    Number.isFinite(parsedPriceFrom) &&
    Number.isFinite(parsedPriceTo) &&
    parsedPriceTo < parsedPriceFrom;
  const isSubmitDisabled =
    isLoadingCreate ||
    isLoadingEdit ||
    !hasRequiredTitle ||
    !hasRequiredDescription ||
    !hasRequiredServices ||
    isLocationInvalid ||
    !hasRequiredPriceType ||
    !hasRequiredPriceFrom ||
    !isPortfolioLinksValid ||
    isPriceRangeInvalid;
  console.log({
    isLoadingCreate,
    isLoadingEdit,
    hasRequiredTitle,
    hasRequiredDescription,
    hasRequiredServices,
    isLocationInvalid,
    hasRequiredPriceType,
    hasRequiredPriceFrom,
    isPortfolioLinksValid,
    isPriceRangeInvalid,
    priceFrom: serviceData.priceFrom,
    hasPriceFrom,
    parsedPriceFrom
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    const payload: Partial<ServiceListing> = {
      ...serviceData,
      equipment: normalizeStringArray(serviceData.equipment),
      languages: normalizeStringArray(serviceData.languages),
      availability: normalizeStringArray(serviceData.availability)
    };

    if (serviceId) {
      editMutation(
        { id: serviceId, data: payload },
        { onSuccess: () => navigate('/services') }
      );
    } else {
      createMutation(payload, { onSuccess: () => navigate('/services') });
    }
  };

  const outlinedInputSx = {
    mb: 2,
    bgcolor: 'background.default',
    '& .MuiOutlinedInput-input': {
      p: '12px'
    }
  };

  const outlinedSelectSx = {
    mb: 2,
    bgcolor: 'background.default',
    '& .MuiSelect-select': {
      p: '12px'
    }
  };

  const labelSx = {
    mb: 1,
    color: 'secondary.main',
    cursor: 'pointer',
    fontSize: '1.125rem'
  };

  if (isLoadingService) {
    return <PageLoader />;
  }

  const formModeLabel = serviceId
    ? t('service.editService', 'Izmeni uslugu')
    : t('service.addService', 'Dodaj uslugu');
  const pages = [
    { label: t('breadcrumbs.home', 'Početna'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    {
      label: formModeLabel,
      route: serviceId ? `/services/${serviceId}/edit` : `/services/create`
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
          gap: 4,
          [theme.breakpoints.up('sm')]: { px: '1.5rem' },
          [theme.breakpoints.up('xl')]: { px: 0 },
          display: 'flex',
          flexDirection: 'column'
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
            lineHeight: 1,
            mb: 4
          })}
        >
          {serviceId
            ? t('service.editService', 'Izmeni uslugu')
            : t('service.offerService', 'Ponudite uslugu')}
        </Typography>

        <Box
          component="form"
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            [theme.breakpoints.up('md')]: { flexDirection: 'row', gap: 5 }
          })}
          onSubmit={handleSubmit}
        >
          {/* Left Column - Core Service Details */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="title" component="label" sx={labelSx}>
              {t('service.titleLabel', 'Naziv usluge/oglasa')} *
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="title"
              id="title"
              placeholder={t(
                'service.titlePlaceholder',
                'Npr. Košenje trave i održavanje dvorišta...'
              )}
              value={serviceData.title || ''}
              onChange={handleChange}
              fullWidth
              sx={outlinedInputSx}
            />

            <Typography component="label" sx={labelSx}>
              {t(
                'service.servicesLabel',
                'Tipovi usluga koje nudite (Izaberite jednu ili više)'
              )}{' '}
              *
            </Typography>

            <Autocomplete
              multiple
              id="services-tags"
              options={flatServicesList}
              value={serviceData.services || []}
              onChange={(_e, newValue) => {
                setServiceData({ ...serviceData, services: newValue });
              }}
              getOptionLabel={(option) =>
                t(`service.serviceNames.${option}`, option)
              }
              renderValue={(value, getItemProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getItemProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      label={t(`service.serviceNames.${option}`, option)}
                      key={key}
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t(
                    'service.searchPlaceholder',
                    'Pronađite i izaberite usluge...'
                  )}
                  variant="outlined"
                  size="medium"
                  sx={{ ...outlinedInputSx, width: '100%' }}
                />
              )}
              sx={{ mb: 2, width: '100%' }}
            />

            <Typography htmlFor="location" component="label" sx={labelSx}>
              {t('service.locationLabel', 'Lokacija (Grad / Naselje)')}
            </Typography>
            <OutlinedInput
              type="text"
              name="location"
              id="location"
              placeholder={t(
                'service.locationPlaceholder',
                'Npr. Beograd, Novi Sad...'
              )}
              value={serviceData.location || ''}
              onChange={handleChange}
              error={isLocationInvalid}
              fullWidth
              sx={outlinedInputSx}
            />
            {isLocationInvalid && (
              <Typography color="error" variant="caption" sx={{ ml: 1, mb: 2 }}>
                {t(
                  'service.locationValidationError',
                  'Lokacija mora sadržati bar jedno slovo.'
                )}
              </Typography>
            )}

            <Typography
              htmlFor="serviceRadiusKm"
              component="label"
              sx={labelSx}
            >
              {t('service.radiusLabel', 'Dolazak na adresu unutar (KM)')}
            </Typography>
            <OutlinedInput
              type="number"
              name="serviceRadiusKm"
              id="serviceRadiusKm"
              placeholder={t('service.radiusPlaceholder', 'Npr. 50')}
              value={serviceData.serviceRadiusKm || ''}
              onChange={handleChange}
              fullWidth
              sx={outlinedInputSx}
            />

            <Typography
              htmlFor="experienceYears"
              component="label"
              sx={labelSx}
            >
              {t('service.experienceLabel', 'Godine iskustva u radu')}
            </Typography>
            <OutlinedInput
              type="number"
              name="experienceYears"
              id="experienceYears"
              placeholder={t('service.experiencePlaceholder', 'Npr. 5')}
              value={serviceData.experienceYears || ''}
              onChange={handleChange}
              fullWidth
              sx={outlinedInputSx}
            />

            <Typography component="label" sx={labelSx}>
              {t('service.equipmentLabel', 'Oprema koju koristite (opciono)')}
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={serviceData.equipment || []}
              onChange={(_e, newValue) =>
                handleArrayFieldChange('equipment', newValue as string[])
              }
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={`${option}-${index}`}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t(
                    'service.equipmentPlaceholder',
                    'Npr. Trimer, kosačica, mini bager...'
                  )}
                  variant="outlined"
                  size="medium"
                  sx={{ ...outlinedInputSx, width: '100%' }}
                />
              )}
              sx={{ mb: 2, width: '100%' }}
            />

            <Typography component="label" sx={labelSx}>
              {t('service.languagesLabel', 'Jezici koje govorite (opciono)')}
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={languageOptions}
              filterSelectedOptions
              forcePopupIcon
              value={serviceData.languages || []}
              onChange={(_e, newValue) =>
                handleArrayFieldChange('languages', newValue)
              }
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={`${option}-${index}`}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t(
                    'service.languagesPlaceholder',
                    'Izaberite jedan ili više jezika'
                  )}
                  variant="outlined"
                  size="medium"
                  sx={{ ...outlinedInputSx, width: '100%' }}
                />
              )}
              sx={{ mb: 2, width: '100%' }}
            />

            <Typography component="label" sx={labelSx}>
              {t('service.availabilityLabel', 'Dostupnost termina (opciono)')}
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={serviceData.availability || []}
              onChange={(_e, newValue) =>
                handleArrayFieldChange('availability', newValue as string[])
              }
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={`${option}-${index}`}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t(
                    'service.availabilityPlaceholder',
                    'Npr. Radnim danima 08-16h, Vikendom po dogovoru...'
                  )}
                  variant="outlined"
                  size="medium"
                  sx={{ ...outlinedInputSx, width: '100%' }}
                />
              )}
              sx={{ mb: 2, width: '100%' }}
            />

            <Typography component="label" sx={labelSx}>
              {t('service.priceTypeLabel', 'Tip naplate')} *
            </Typography>
            <FormControl fullWidth>
              <Select
                name="priceType"
                value={serviceData.priceType || 'fixed'}
                onChange={handleSelectChange}
                sx={outlinedSelectSx}
              >
                <MenuItem value="fixed">
                  {t('service.fixedPriceOption', 'Fiksna cena (po projektu)')}
                </MenuItem>
                <MenuItem value="hourly">
                  {t('service.hourlyPriceOption', 'Po satu')}
                </MenuItem>
                <MenuItem value="negotiable">
                  {t(
                    'service.negotiablePriceOption',
                    'Cena na upit (Po dogovoru)'
                  )}
                </MenuItem>
              </Select>
            </FormControl>

            {serviceData.priceType !== 'negotiable' && (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    htmlFor="priceFrom"
                    component="label"
                    sx={labelSx}
                  >
                    {t('service.priceFromLabel', 'Cena od (RSD)')}
                  </Typography>
                  <OutlinedInput
                    type="number"
                    name="priceFrom"
                    id="priceFrom"
                    placeholder={t(
                      'service.priceFromPlaceholder',
                      'Minimalna cena'
                    )}
                    value={serviceData.priceFrom || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    fullWidth
                    sx={outlinedInputSx}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography htmlFor="priceTo" component="label" sx={labelSx}>
                    {t('service.priceToLabel', 'Cena do (RSD)')}
                  </Typography>
                  <OutlinedInput
                    type="number"
                    name="priceTo"
                    id="priceTo"
                    placeholder={t(
                      'service.priceToPlaceholder',
                      'Maksimalna cena (Opciono)'
                    )}
                    value={serviceData.priceTo || ''}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    error={isPriceRangeInvalid}
                    fullWidth
                    sx={outlinedInputSx}
                  />
                  {isPriceRangeInvalid && (
                    <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                      {t(
                        'service.priceRangeError',
                        'Maksimalna cena mora biti veća ili jednaka minimalnoj ceni.'
                      )}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Column - Images and Multimedia */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography component="label" sx={labelSx}>
              {t('service.addPhotosLabel', 'Dodaj fotografije radova')}
            </Typography>

            {Boolean(serviceData.images?.length) && (
              <Box
                sx={(theme) => ({
                  width: '100%',
                  minHeight: 80,
                  mb: 2,
                  gap: 2,
                  borderRadius: 1,
                  boxShadow: 2,
                  p: 2,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
                  },
                  border: '1px solid',
                  borderColor: 'secondary.main'
                })}
              >
                {serviceData.images?.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <DeleteOutlinedIcon
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'primary.main',
                        fontSize: 28,
                        cursor: 'pointer',
                        zIndex: 2,
                        bgcolor: 'rgba(255,255,255,0.7)',
                        borderRadius: '50%'
                      }}
                      onClick={() => handleDeleteImage(index)}
                    />

                    <Box
                      component="img"
                      src={formatImageUrl(image, 55)}
                      alt={`service-image-${index}`}
                      sx={{
                        aspectRatio: '1 / 1',
                        boxShadow: 2,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />

                    {index !== 0 && (
                      <Button
                        onClick={() => handleSetAsProfileImage(index)}
                        variant="contained"
                        color="secondary"
                        sx={{
                          mt: 1,
                          width: '100%',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          p: 0.5
                        }}
                      >
                        {t('common.setAsProfile', 'Postavi kao naslovnu')}
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Button
              component="label"
              variant="outlined"
              color="primary"
              disabled={
                (serviceData.images?.length || 0) >= 10 || isImageLoading
              }
              sx={(theme) => ({
                py: 1,
                px: 2,
                boxShadow: 2,
                textAlign: 'center',
                mx: 'auto',
                textTransform: 'uppercase',
                mb: !serviceData.images?.length ? 4 : 2,
                [theme.breakpoints.up('md')]: {
                  mb: 0,
                  mx: 0,
                  '&:hover': {
                    color: 'common.black',
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  }
                },
                mt: !serviceData.images?.length ? 1 : 0
              })}
            >
              {isImageLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <Typography variant="button" color="inherit">
                    {t('common.loading', 'Učitavanje...')}
                  </Typography>
                </Box>
              ) : (serviceData.images?.length || 0) >= 10 ? (
                t(
                  'createEditProduct.maxImages',
                  'Maksimalan broj slika dostignut'
                )
              ) : (
                t('service.addImageButton', 'DODAJ FOTOGRAFIJU')
              )}
              <Box
                component="input"
                type="file"
                disabled={
                  (serviceData.images?.length || 0) >= 10 || isImageLoading
                }
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImage}
                sx={{ display: 'none' }}
                data-max-size={MAX_IMAGE_MB}
              />
            </Button>

            <Alert severity="info" sx={{ my: 2 }}>
              <AlertTitle>{t('createEditProduct.photoInfo.title')}</AlertTitle>
              <List sx={{ pl: 3, listStyleType: 'disc' }}>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText
                    primary={t('createEditProduct.photoInfo.ratio')}
                  />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText
                    primary={t('createEditProduct.photoInfo.firstIsProfile')}
                  />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText
                    primary={t('createEditProduct.photoInfo.maxPhotos')}
                  />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText
                    primary={t('createEditProduct.photoInfo.maxSize')}
                  />
                </ListItem>
              </List>
            </Alert>

            <Typography htmlFor="description" component="label" sx={labelSx}>
              {t(
                'service.descriptionLabel',
                'Detaljan opis usluga koje nudite'
              )}{' '}
              *
            </Typography>
            <Box sx={{ mb: 4 }}>
              <ReactQuill
                modules={modules}
                value={serviceData.description || ''}
                onChange={handleRichTextDescription}
                id="description"
                theme="snow"
                style={{ minHeight: 200 }}
              />
              <style>
                {`
                .ql-toolbar.ql-snow{
                  border-top-left-radius: 0.375rem;
                  border-top-right-radius: 0.375rem;
                  border-color: rgb(38 96 65) !important;
                }
                .ql-container {
                  min-height: 200px !important;
                  border-bottom-left-radius: 0.375rem;
                  border-bottom-right-radius: 0.375rem;
                  border-color: rgb(38 96 65) !important;
                }
                `}
              </style>
            </Box>

            <Typography component="label" sx={labelSx}>
              {t(
                'service.portfolioLinksLabel',
                'Linkovi do portfolija (npr. Instagram, Vaš sajt, LinkedIn)'
              )}
            </Typography>
            <Box
              sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {serviceData.portfolioLinks?.map((link, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}
                >
                  <Box
                    sx={(theme) => ({
                      flex: 1,
                      display: 'flex',
                      gap: 2,
                      flexDirection: 'column',
                      [theme.breakpoints.up('sm')]: { flexDirection: 'row' }
                    })}
                  >
                    <Box sx={{ flex: 1 }}>
                      <OutlinedInput
                        placeholder={t(
                          'service.linkLabelPlaceholder',
                          'Naziv (npr. Moj Sajt)'
                        )}
                        value={link.label}
                        onChange={(e) =>
                          handlePortfolioLinkChange(
                            index,
                            'label',
                            e.target.value
                          )
                        }
                        fullWidth
                        sx={{
                          bgcolor: 'background.default',
                          '& .MuiOutlinedInput-input': { p: '12px' }
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <OutlinedInput
                        placeholder={t(
                          'service.linkUrlPlaceholder',
                          'URL (npr. https://mojsajt.com)'
                        )}
                        value={link.url}
                        onChange={(e) =>
                          handlePortfolioLinkChange(
                            index,
                            'url',
                            e.target.value
                          )
                        }
                        fullWidth
                        error={link.url.trim() !== '' && !isValidUrl(link.url)}
                        sx={{
                          bgcolor: 'background.default',
                          '& .MuiOutlinedInput-input': { p: '12px' }
                        }}
                      />
                      {link.url.trim() !== '' && !isValidUrl(link.url) && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ ml: 1, mt: 0.5, display: 'block' }}
                        >
                          {t(
                            'service.invalidUrlError',
                            'Unesite ispravan URL (npr. https://...)'
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Button
                    onClick={() => handleRemovePortfolioLink(index)}
                    color="error"
                    sx={(theme) => ({
                      minWidth: 'auto',
                      p: 1,
                      mt: 0,
                      [theme.breakpoints.up('sm')]: { mt: '2px' }
                    })}
                  >
                    <RemoveCircleOutlineIcon />
                  </Button>
                </Box>
              ))}
              <Button
                onClick={handleAddPortfolioLink}
                startIcon={<AddCircleOutlineIcon />}
                variant="outlined"
                color="secondary"
                disabled={!canAddNewPortfolioLink}
                sx={{ alignSelf: 'flex-start', mt: 1, textTransform: 'none' }}
              >
                {t('service.addPortfolioLink', 'Dodaj link')}
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitDisabled}
              fullWidth
            >
              {isLoadingCreate || isLoadingEdit ? (
                <CircularProgress size={24} color="inherit" />
              ) : serviceId ? (
                t('service.submitEdit', 'Sačuvaj izmene')
              ) : (
                t('service.submitCreate', 'Kreiraj oglas za uslugu')
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for oversized images */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {t(
            'createEditProduct.imageTooLarge',
            'Fotografija ne sme biti veća od 10MB.'
          )}
        </Alert>
      </Snackbar>
    </PageContent>
  );
};
