'use client';

import {
  AppBreadcrumbs,
  PageContent,
  PageLoader,
  PageTitle
} from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useDeleteImage } from '@green-world/hooks/useDeleteImage';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useGenerateAiDescription } from '@green-world/hooks/useGenerateAiDescription';
import { useImage } from '@green-world/hooks/useImage';
import {
  ImageAutofillResponse,
  useImageAutofill
} from '@green-world/hooks/useImageAutofill';
import { useModerateText } from '@green-world/hooks/useModerateText';
import { useProduct } from '@green-world/hooks/useProduct';
import {
  groupItemsCreateProduct,
  subGroups
} from '@green-world/utils/constants';
import {
  formatImageUrl,
  getPlainTextFromHtml,
  getLocalizedSubGroupLabel,
  getLocalizedGroupLabel
} from '@green-world/utils/helpers';
import { Product, SubGroup, SubGroupKeys } from '@green-world/utils/types';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  MenuItem,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  TextField,
  Select,
  SelectChangeEvent,
  Snackbar,
  Card,
  Typography
} from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import { AiButton } from './component';

const initProduct: Product = {
  _id: '',
  group: '' as keyof typeof subGroups,
  subGroup: '',
  title: '',
  description: '',
  shortDescription: '',
  images: [],
  price: 0,
  priceOnRequest: false,
  height: 0,
  width: 0,
  weight: 0,
  milliliters: 0,
  createdBy: '',
  status: '',
  onStock: true
};

const MAX_IMAGE_MB = 10 * 1024 * 1024;

type InappropriateFields = {
  title: boolean;
  description: boolean;
  shortDescription: boolean;
};

export const CreateEditProduct = () => {
  const { t, i18n } = useTranslation();
  const { productId = '' } = useParams();
  const { data, isLoading } = useProduct(productId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [aiSnackbarOpen, setAiSnackbarOpen] = useState(false);
  const [aiSnackbarMessage, setAiSnackbarMessage] = useState('');
  const [aiSnackbarSeverity, setAiSnackbarSeverity] = useState<
    'success' | 'error'
  >('success');

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

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleCloseAiSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setAiSnackbarOpen(false);
  };

  const { mutateAsync: uploadImage, isPending: isImageLoading } = useImage();

  const { mutate: createMutation, isPending: isLoadingCreateProduct } =
    useCreateProduct();

  const { mutate: editMutation, isPending: isLoadingEditProduct } =
    useEditProduct(productId);

  const { mutate: deleteImageMutate } = useDeleteImage();
  const { mutateAsync: generateDescription } = useGenerateAiDescription(
    t('createEditProduct.ai.generationError')
  );
  const { mutateAsync: imageAutofill, isPending: isAiImageAutofillLoading } =
    useImageAutofill(t('createEditProduct.ai.imageAutofillFailed'));
  const { mutateAsync: moderateText } = useModerateText();

  const [product, setProduct] = useState<Product>(initProduct);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [inappropriateFields, setInappropriateFields] =
    useState<InappropriateFields>({
      title: false,
      description: false,
      shortDescription: false
    });

  const allowedGroupsForAi = React.useMemo<Record<string, string[]>>(
    () =>
      Object.fromEntries(
        groupItemsCreateProduct.map((item) => [
          item.key,
          subGroups[item.key].map((subGroup) => subGroup.label)
        ])
      ),
    []
  );

  const isCreateMode = !productId;
  const hasImages = (product?.images?.length ?? 0) > 0;

  const handleCheckboxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setProduct({
      ...product,
      priceOnRequest: checked
    });
  };

  useEffect(() => {
    if (!isLoading) {
      setProduct(data || initProduct);
    }
  }, [data, isLoading]);

  const handleGroupChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, group: e.target.value as keyof typeof subGroups });
  };

  const handleSubGroupChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, subGroup: e.target.value });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    e.target.value = '';

    if (!selectedFiles.length) return;

    const existingCount = product?.images?.length || 0;
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
        setProduct((prevProduct) => ({
          ...prevProduct,
          images: [...(prevProduct?.images || []), imageUrl]
        }));
      } catch {
        // Keep processing remaining files even if one upload fails.
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      inappropriateFields.title ||
      inappropriateFields.description ||
      inappropriateFields.shortDescription
    ) {
      setAiSnackbarSeverity('error');
      setAiSnackbarMessage(t('createEditProduct.ai.submitBlockedWarning'));
      setAiSnackbarOpen(true);
      return;
    }

    productId ? editMutation(product) : createMutation(product);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const deletedImage = product?.images[indexToDelete];
    const updatedImages = product?.images.filter(
      (_, index) => index !== indexToDelete
    );

    deleteImageMutate(deletedImage);

    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages
    }));
  };

  const handleRichTextDescription = (richText: string) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: richText
    }));
  };

  const handleSetAsProfileImage = (index: number) => {
    setProduct((prevProduct) => {
      if (index === 0) return prevProduct;

      const updatedImages = [...prevProduct.images];
      const selectedImage = updatedImages.splice(index, 1)[0];
      updatedImages.unshift(selectedImage);
      return {
        ...prevProduct,
        images: updatedImages
      };
    });
  };

  const outlinedInputSx = {
    mb: 2,
    bgcolor: 'background.default',
    '& .MuiOutlinedInput-input': {
      p: '12px'
    }
  };

  const getModerationOutlinedSx = (fieldFlagged: boolean) => ({
    ...outlinedInputSx,
    ...(fieldFlagged
      ? {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'warning.main',
            borderWidth: 2
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'warning.main',
            borderWidth: 2
          }
        }
      : {})
  });

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

  const generateAiDescription = async (params: {
    title: string;
    keywords: string[];
    images: string[];
    context: { group: Product['group']; subGroup: string };
    successMessage?: string;
  }) => {
    try {
      const { descriptionHtml } = await generateDescription({
        title: params.title,
        keywords: params.keywords,
        images: params.images,
        context: params.context
      });

      handleRichTextDescription(descriptionHtml);
      setAiSnackbarSeverity('success');
      setAiSnackbarMessage(
        params.successMessage || t('createEditProduct.ai.generated')
      );
      setAiSnackbarOpen(true);
    } catch (e: unknown) {
      setAiSnackbarSeverity('error');
      setAiSnackbarMessage(
        e instanceof Error
          ? e.message
          : t('createEditProduct.ai.generationFailed')
      );
      setAiSnackbarOpen(true);
    }
  };

  const handleAiImageAutofillClick = () => {
    const profileImage = product?.images?.[0];

    if (!profileImage) return;

    void handleImageAutofill(profileImage);
  };

  const handleImageAutofill = async (rawImageUrl: string) => {
    try {
      const suggestion: ImageAutofillResponse = await imageAutofill({
        imageUrl: formatImageUrl(rawImageUrl),
        allowedGroups: allowedGroupsForAi
      });

      const nextTitle = product.title || suggestion.title || '';
      const nextGroup =
        (!product.group && suggestion.group
          ? (suggestion.group as keyof typeof subGroups)
          : product.group) || ('' as Product['group']);

      const allowedSubGroupsForNextGroup = nextGroup
        ? subGroups[nextGroup as SubGroupKeys]
        : [];

      const nextSubGroup =
        !product.subGroup &&
        suggestion.subGroup &&
        allowedSubGroupsForNextGroup.some(
          (subGroup) => subGroup.label === suggestion.subGroup
        )
          ? suggestion.subGroup
          : product.subGroup;

      const nextKeywords =
        keywords.length > 0
          ? keywords
          : Array.isArray(suggestion.keywords)
            ? suggestion.keywords
                .map((value) => String(value).trim())
                .filter(Boolean)
                .slice(0, 10)
            : [];

      setProduct((prevProduct) => {
        return {
          ...prevProduct,
          title: prevProduct.title || suggestion.title || prevProduct.title,
          shortDescription:
            prevProduct.shortDescription ||
            suggestion.shortDescription ||
            prevProduct.shortDescription,
          group: nextGroup,
          subGroup: nextSubGroup
        };
      });

      setKeywords((prev) => {
        if (prev.length > 0) return prev;
        return nextKeywords;
      });

      const canAutoGenerateDescription =
        nextTitle.trim().length > 2 && nextKeywords.length >= 2;

      if (canAutoGenerateDescription) {
        await generateAiDescription({
          title: nextTitle,
          keywords: nextKeywords,
          images: product.images?.map(formatImageUrl) || [],
          context: {
            group: nextGroup,
            subGroup: nextSubGroup
          },
          successMessage: t('createEditProduct.ai.imageAutofillSuccess')
        });
      } else {
        setAiSnackbarSeverity('success');
        setAiSnackbarMessage(t('createEditProduct.ai.imageAutofillSuccess'));
        setAiSnackbarOpen(true);
      }
    } catch (e: unknown) {
      setAiSnackbarSeverity('error');
      setAiSnackbarMessage(
        e instanceof Error
          ? e.message
          : t('createEditProduct.ai.imageAutofillFailed')
      );
      setAiSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const titleValue = product?.title?.trim() || '';
    const descriptionValue = getPlainTextFromHtml(product?.description).trim();
    const shortDescriptionValue = product?.shortDescription?.trim() || '';

    if (!titleValue && !descriptionValue && !shortDescriptionValue) {
      setInappropriateFields({
        title: false,
        description: false,
        shortDescription: false
      });
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const moderation = await moderateText({
          fields: {
            title: titleValue,
            description: descriptionValue,
            shortDescription: shortDescriptionValue
          }
        });

        const flagged = moderation.flaggedFields || [];
        setInappropriateFields({
          title: flagged.includes('title'),
          description: flagged.includes('description'),
          shortDescription: flagged.includes('shortDescription')
        });
      } catch {
        // Do not block the form if moderation service fails.
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    moderateText,
    product?.title,
    product?.description,
    product?.shortDescription
  ]);

  if (isLoading) {
    return <PageLoader />;
  }

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    {
      label: `${
        productId
          ? t('createEditProduct.actionUpdate')
          : t('createEditProduct.actionCreate')
      } ${t('createEditProduct.product')}`,
      route: `/${productId ? 'edit' : 'create'}-product`
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
          gap: 4,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column'
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <PageTitle>
          {productId
            ? t('createEditProduct.headingEdit')
            : t('createEditProduct.headingCreate')}
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
            <Typography
              htmlFor={
                product?.images?.length >= 10 ? undefined : 'profileImage'
              }
              component="label"
              sx={{ ...labelSx, mt: 1 }}
            >
              {t('createEditProduct.addPhotosLabel')}
            </Typography>
            {Boolean(product?.images.length) && (
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
                {product?.images?.map((image, index) => (
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
                        zIndex: 2
                      }}
                      onClick={() => handleDeleteImage(index)}
                      titleAccess={t('createEditProduct.deleteImage')}
                    />

                    <Box
                      component="img"
                      src={formatImageUrl(image, 55)}
                      alt={`product-image-${index}`}
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
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'none'
                        }}
                      >
                        {t('createEditProduct.setAsProfile')}
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
              disabled={product?.images?.length >= 10 || isImageLoading}
              sx={(theme) => ({
                py: 1,
                px: 2,
                boxShadow: 2,
                textAlign: 'center',
                mx: 'auto',
                textTransform: 'uppercase',
                mb: !product?.images?.length ? 4 : 2,
                [theme.breakpoints.up('md')]: {
                  mb: 0,
                  mx: 0,
                  '&:hover': {
                    color: 'common.black',
                    boxShadow: 4,
                    transform: 'translateY(-1px)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: 2
                  }
                },
                mt: !product?.images?.length ? 1 : 0
              })}
            >
              {product?.images?.length >= 10
                ? t('createEditProduct.maxImages')
                : t('createEditProduct.addImageButton')}
              <Box
                component="input"
                type="file"
                disabled={product?.images?.length >= 10 || isImageLoading}
                name="profileImage"
                id="profileImage"
                multiple
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImage}
                sx={{ display: 'none' }}
                data-max-size={MAX_IMAGE_MB}
              />
            </Button>
            {!hasImages && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <AlertTitle>
                  {t('createEditProduct.photoInfo.title')}
                </AlertTitle>
                <List sx={{ pl: 3, listStyleType: 'disc' }}>
                  <ListItem sx={{ display: 'list-item', p: 0 }}>
                    <ListItemText
                      primary={t('createEditProduct.ai.manualOrAiHint')}
                    />
                  </ListItem>
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
            )}
            {isCreateMode && (hasImages || isAiImageAutofillLoading) && (
              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5
                }}
              >
                {hasImages && (
                  <>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <AiButton
                        isAiLoading={isAiImageAutofillLoading}
                        canGenerate={hasImages}
                        onClick={handleAiImageAutofillClick}
                        label={t('createEditProduct.ai.imageAutofillButton')}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('createEditProduct.ai.imageAutofillHint')}
                    </Typography>
                  </>
                )}
                {isAiImageAutofillLoading && (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">
                      {t('createEditProduct.ai.imageAutofillLoading')}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            <Typography htmlFor="group" component="label" sx={labelSx}>
              {t('createEditProduct.selectGroupLabel')}
            </Typography>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={product.group || ''}
                onChange={handleGroupChange}
                disabled={isLoading}
                sx={outlinedSelectSx}
              >
                <MenuItem value="" disabled>
                  {t('createEditProduct.selectGroupPlaceholder')}
                </MenuItem>
                {groupItemsCreateProduct.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {t(item.labelKey, {
                      defaultValue: getLocalizedGroupLabel(
                        item.key,
                        i18n.language
                      )
                    })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              htmlFor="subGroup"
              component="label"
              sx={{ ...labelSx, mt: 1 }}
            >
              {t('createEditProduct.selectSubGroupLabel')}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                displayEmpty
                value={product.subGroup || ''}
                onChange={handleSubGroupChange}
                disabled={isLoading}
                sx={outlinedSelectSx}
              >
                <MenuItem value="" disabled>
                  {t('createEditProduct.selectSubGroupPlaceholder')}
                </MenuItem>
                {subGroups[
                  (product.group as SubGroupKeys) || 'flower_assortment'
                ]!.map((item: SubGroup) => (
                  <MenuItem key={item?.label} value={item?.label}>
                    {getLocalizedSubGroupLabel(
                      product.group as SubGroupKeys,
                      item.label,
                      i18n.language
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="title" component="label" sx={labelSx}>
              {t('createEditProduct.productNameLabel')}
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="title"
              id="title"
              placeholder={t('createEditProduct.productNamePlaceholder')}
              value={product?.title || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={getModerationOutlinedSx(inappropriateFields.title)}
            />
            {inappropriateFields.title && (
              <Typography
                variant="caption"
                sx={{ color: 'warning.main', mt: -1.5, mb: 1.5 }}
              >
                {t('createEditProduct.ai.inappropriateFieldWarning')}
              </Typography>
            )}

            <Card sx={{ p: 2, borderColor: 'divider' }}>
              <Typography component="label" sx={{ ...labelSx, mt: 1 }}>
                {t('createEditProduct.ai.keywordsLabel')}
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={keywords}
                onChange={(_, vals) => {
                  const cleaned = vals
                    .flatMap((v) => String(v).split(','))
                    .map((v) => v.trim())
                    .filter(Boolean)
                    .slice(0, 10);
                  setKeywords(cleaned);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('createEditProduct.ai.keywordsPlaceholder')}
                  />
                )}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.default'
                  }
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 1 }}
              >
                {t('createEditProduct.ai.hint')}
              </Typography>
            </Card>

            <Box sx={{ mt: 1.5, mb: 1 }}>
              <Typography
                htmlFor="description"
                component="label"
                sx={{ ...labelSx, mb: 0 }}
              >
                {t('createEditProduct.descriptionLabel')}
              </Typography>
            </Box>

            <Box
              sx={{
                mb: 2,
                ...(inappropriateFields.description
                  ? {
                      '& .ql-toolbar.ql-snow, & .ql-container': {
                        borderColor: 'warning.main !important'
                      }
                    }
                  : {})
              }}
            >
              <ReactQuill
                modules={modules}
                value={product?.description || ''}
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
            {inappropriateFields.description && (
              <Typography
                variant="caption"
                sx={{ color: 'warning.main', mt: -1, mb: 2 }}
              >
                {t('createEditProduct.ai.inappropriateFieldWarning')}
              </Typography>
            )}

            <Typography
              htmlFor="shortDescription"
              component="label"
              sx={labelSx}
            >
              {t('createEditProduct.shortDescriptionLabel')}{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: 'text.secondary', fontStyle: 'italic' }}
              >
                {t('createEditProduct.max80')}
              </Typography>
            </Typography>
            <OutlinedInput
              name="shortDescription"
              id="shortDescription"
              inputProps={{ maxLength: 80 }}
              placeholder={t('createEditProduct.shortDescriptionPlaceholder')}
              value={product?.shortDescription || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={getModerationOutlinedSx(inappropriateFields.shortDescription)}
            />
            {inappropriateFields.shortDescription && (
              <Typography
                variant="caption"
                sx={{ color: 'warning.main', mt: -1.5, mb: 1.5 }}
              >
                {t('createEditProduct.ai.inappropriateFieldWarning')}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 2 }}
            >
              {t('createEditProduct.shortDescriptionHint')}
            </Typography>

            <Typography htmlFor="price" component="label" sx={labelSx}>
              {t('createEditProduct.priceLabel')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }}
            >
              {t('createEditProduct.priceHint')}
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="price"
              id="price"
              placeholder={t('createEditProduct.pricePlaceholder')}
              value={product?.price || ''}
              onChange={handleChange}
              disabled={product?.priceOnRequest}
              fullWidth
              sx={outlinedInputSx}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
              <Checkbox
                checked={product?.priceOnRequest ?? false}
                onChange={handleCheckboxPrice}
                color="success"
                id="priceOnRequest"
              />
              <Typography
                htmlFor="priceOnRequest"
                component="label"
                sx={{ color: 'secondary.main', fontSize: '1rem' }}
              >
                {t('createEditProduct.priceOnRequestLabel')}{' '}
                <strong>{t('createEditProduct.priceOnRequest')}</strong>
              </Typography>
            </Box>

            <Typography htmlFor="height" component="label" sx={labelSx}>
              {t('createEditProduct.heightLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="height"
              id="height"
              placeholder={t('createEditProduct.heightPlaceholder')}
              value={product?.height || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="width" component="label" sx={labelSx}>
              {t('createEditProduct.widthLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="width"
              id="width"
              placeholder={t('createEditProduct.widthPlaceholder')}
              value={product?.width || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="weight" component="label" sx={labelSx}>
              {t('createEditProduct.weightLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="weight"
              id="weight"
              placeholder={t('createEditProduct.weightPlaceholder')}
              value={product?.weight || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="milliliters" component="label" sx={labelSx}>
              {t('createEditProduct.millilitersLabel')}
            </Typography>
            <OutlinedInput
              type="text"
              name="milliliters"
              id="milliliters"
              placeholder={t('createEditProduct.millilitersPlaceholder')}
              value={product?.milliliters || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
              disabled={isLoading || isImageLoading}
              sx={{
                mt: 4
              }}
            >
              {isLoading ||
              isImageLoading ||
              isLoadingCreateProduct ||
              isLoadingEditProduct ? (
                <CircularProgress
                  size={20}
                  sx={{ color: 'primary.main', my: 1 }}
                />
              ) : productId ? (
                t('createEditProduct.submitUpdate')
              ) : (
                t('createEditProduct.submitCreate')
              )}
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {t('createEditProduct.maxFileSizeError')}
        </Alert>
      </Snackbar>
      <Snackbar
        open={aiSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseAiSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAiSnackbar}
          severity={aiSnackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {aiSnackbarMessage}
        </Alert>
      </Snackbar>
    </PageContent>
  );
};
