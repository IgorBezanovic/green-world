'use client';

import {
  AppBreadcrumbs,
  PageContent,
  PageLoader
} from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useDeleteImage } from '@green-world/hooks/useDeleteImage';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useImage } from '@green-world/hooks/useImage';
import { useProduct } from '@green-world/hooks/useProduct';
import {
  groupItemsCreateProduct,
  subGroups
} from '@green-world/utils/constants';
import {
  formatImageUrl,
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

  const [product, setProduct] = useState<Product>(initProduct);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const canGenerate =
    (product?.title?.trim()?.length ?? 0) > 2 &&
    (product?.images?.length ?? 0) > 0 &&
    keywords.length >= 2 &&
    keywords.length <= 10;

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

  const handleGenerateAiDescription = async () => {
    try {
      setIsAiLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(baseUrl + 'ai/description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: product.title,
          keywords,
          images: product.images?.map(formatImageUrl),
          context: {
            group: product.group,
            subGroup: product.subGroup
          }
        })
      });

      if (!res.ok) {
        const { error } = await res
          .json()
          .catch(() => ({ error: t('createEditProduct.ai.genericError') }));
        throw new Error(error || t('createEditProduct.ai.generationError'));
      }

      const { descriptionHtml } = await res.json();
      handleRichTextDescription(descriptionHtml);
      setAiSnackbarSeverity('success');
      setAiSnackbarMessage(t('createEditProduct.ai.generated'));
      setAiSnackbarOpen(true);
    } catch (e: any) {
      setAiSnackbarSeverity('error');
      setAiSnackbarMessage(
        e?.message || t('createEditProduct.ai.generationFailed')
      );
      setAiSnackbarOpen(true);
    } finally {
      setIsAiLoading(false);
    }
  };

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
          {productId
            ? t('createEditProduct.headingEdit')
            : t('createEditProduct.headingCreate')}
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
            <Alert severity="info" sx={{ mt: 2 }}>
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
              sx={outlinedInputSx}
            />

            <Card sx={{ p: 2, borderColor: 'divider' }}>
              <Typography variant="h4" color="secondary">
                {t('createEditProduct.ai.title')}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                {t('createEditProduct.ai.conditions')}
              </Typography>
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

            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mt: 1.5,
                mb: 1,
                [theme.breakpoints.up('md')]: {
                  flexDirection: 'row'
                }
              })}
            >
              <Typography
                htmlFor="description"
                component="label"
                sx={{ ...labelSx, mb: 0 }}
              >
                {t('createEditProduct.descriptionLabel')}
              </Typography>
              <AiButton
                isAiLoading={isAiLoading}
                canGenerate={canGenerate}
                onClick={handleGenerateAiDescription}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
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
              sx={outlinedInputSx}
            />
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
