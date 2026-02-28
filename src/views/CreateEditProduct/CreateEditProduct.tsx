import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useCreateProduct } from '@green-world/hooks/useCreateProduct';
import { useDeleteImage } from '@green-world/hooks/useDeleteImage';
import { useEditProduct } from '@green-world/hooks/useEditProduct';
import { useImage } from '@green-world/hooks/useImage';
import { useProduct } from '@green-world/hooks/useProduct';
import {
  groupItemsCreateProduct,
  subGroups
} from '@green-world/utils/constants';
import { formatImageUrl } from '@green-world/utils/helpers';
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
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { useParams } from 'react-router';

import 'react-quill-new/dist/quill.snow.css';
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
  const { productId = '' } = useParams();
  const { data = initProduct, isLoading } = useProduct(productId);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [aiSnackbarOpen, setAiSnackbarOpen] = useState(false);
  const [aiSnackbarMessage, setAiSnackbarMessage] = useState('');
  const [aiSnackbarSeverity, setAiSnackbarSeverity] = useState<
    'success' | 'error'
  >('success');

  const quillRef = useRef<ReactQuill>(null);
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

  const {
    mutate: imageMutate,
    isPending: isImageLoading,
    data: productImage
  } = useImage();

  const { mutate: createMutation, isPending: isLoadingCreateProduct } =
    useCreateProduct();

  const { mutate: editMutation, isPending: isLoadingEditProduct } =
    useEditProduct(productId);

  const { mutate } = useDeleteImage();

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
      setProduct(data);
    }
  }, [data, isLoading]);

  useEffect(() => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: productImage
        ? [...(prevProduct?.images || []), productImage]
        : prevProduct?.images || []
    }));
  }, [productImage]);

  const handleGroupChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, group: e.target.value as keyof typeof subGroups });
  };

  const handleSubGroupChange = (e: SelectChangeEvent<string>) => {
    setProduct({ ...product, subGroup: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files!)[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_MB) {
      setSnackbarOpen(true);
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    imageMutate(formData);
    e.target.value = '';
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

    mutate(deletedImage);

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
      const baseUrl = import.meta.env.VITE_API_URL;
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
        const { error } = await res.json().catch(() => ({ error: 'Greška' }));
        throw new Error(error || 'Greška pri generisanju opisa.');
      }

      const { descriptionHtml } = await res.json();
      handleRichTextDescription(descriptionHtml);
      setAiSnackbarSeverity('success');
      setAiSnackbarMessage('AI opis generisan ✅');
      setAiSnackbarOpen(true);
    } catch (e: any) {
      setAiSnackbarSeverity('error');
      setAiSnackbarMessage(e?.message || 'Nije uspelo generisanje opisa.');
      setAiSnackbarOpen(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  const pageTitle = `Zeleni svet | ${productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}`;
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Korisnički profil', route: '/profile' },
    {
      label: `${productId ? 'Ažuriraj' : 'Kreiraj'} proizvod`,
      route: `/${productId ? 'edit' : 'create'}-product`
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={pageTitle} />
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
          sx={{
            color: 'primary.main',
            fontSize: { xs: '3rem', md: '3.75rem' },
            fontFamily: 'Ephesis',
            mx: 'auto',
            lineHeight: 1
          }}
        >
          {productId ? 'Azuziraj proizvod' : 'Kreiraj proizvod'}
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
              Odaberite pripadajuću grupu:
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
                  Odaberi grupu proizvoda
                </MenuItem>
                {groupItemsCreateProduct.map((item) => (
                  <MenuItem key={item.key} value={item.key}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography
              htmlFor="subGroup"
              component="label"
              sx={{ ...labelSx, mt: 1 }}
            >
              Odaberite pripadajuću podgrupu:
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
                  Odaberi podgrupu proizvoda
                </MenuItem>
                {subGroups[
                  (product.group as SubGroupKeys) || 'flower_assortment'
                ]!.map((item: SubGroup) => (
                  <MenuItem key={item?.label} value={item?.label}>
                    {item?.sr_RS}
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
              Dodajte fotografije proizvoda:
            </Typography>
            {Boolean(product?.images.length) && (
              <Box
                sx={{
                  width: '100%',
                  minHeight: 80,
                  mb: 2,
                  gap: 2,
                  borderRadius: 1,
                  boxShadow: 2,
                  p: 2,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, minmax(0, 1fr))',
                    md: 'repeat(4, minmax(0, 1fr))'
                  },
                  border: '1px solid',
                  borderColor: 'secondary.main'
                }}
              >
                {product?.images?.map((image, index) => (
                  <Box key={index} sx={{ width: '100%', position: 'relative' }}>
                    <DeleteOutlinedIcon
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'primary.main',
                        fontSize: 28,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteImage(index)}
                      titleAccess="Obrisi sliku"
                    />
                    <Box
                      component="img"
                      src={formatImageUrl(image, 55)}
                      alt={`product-image-${index}`}
                      sx={{
                        aspectRatio: '1 / 1',
                        boxShadow: 2,
                        objectFit: 'cover'
                      }}
                      height="100%"
                      width="100%"
                    />
                    {index !== 0 && (
                      <Button
                        onClick={() => handleSetAsProfileImage(index)}
                        variant="contained"
                        color="secondary"
                        sx={{
                          mt: 1,
                          px: 1.5,
                          py: 0.5,
                          width: '100%',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'none'
                        }}
                      >
                        Profilna
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
              disabled={product?.images?.length >= 10}
              sx={(theme) => ({
                py: 1,
                px: 2,
                boxShadow: 2,
                textAlign: 'center',
                mx: 'auto',
                textTransform: 'uppercase',
                mb: { xs: !product?.images?.length ? 4 : 2, md: 0 },
                mt: !product?.images?.length ? 1 : 0,
                [theme.breakpoints.up('md')]: {
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
                }
              })}
            >
              {product?.images?.length >= 10
                ? 'Maksimalno 10 slika'
                : 'Dodaj sliku proizvoda'}
              <Box
                component="input"
                type="file"
                disabled={product?.images?.length >= 10}
                name="profileImage"
                id="profileImage"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImage}
                sx={{ display: 'none' }}
                data-max-size={MAX_IMAGE_MB}
              />
            </Button>
            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>Informacije o dodavanju fotografija</AlertTitle>
              <List sx={{ pl: 3, listStyleType: 'disc' }}>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Idealna razmera za fotografije 1/1 square." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Prva slika u nizu je profilna." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Maksimum 10 fotografija." />
                </ListItem>
                <ListItem sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText primary="Jedna fotografija maximum 10MB." />
                </ListItem>
              </List>
            </Alert>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography htmlFor="title" component="label" sx={labelSx}>
              Naziv proizvoda:
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="title"
              id="title"
              placeholder="Unesite naziv proizvoda"
              value={product?.title || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />

            <Card sx={{ p: 2, borderColor: 'divider' }}>
              <Typography variant="h4" color="secondary">
                AI generisanje opisa proizvoda:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                Uslovi za AI generisanje deskripcije: dodata minimum jedna
                fotografija, popunjen naziv proizvoda i dodato minimum 2, a
                maximum 10 ključnih reci
              </Typography>
              <Typography component="label" sx={{ ...labelSx, mt: 1 }}>
                Ključne fraze za generisanje (min 2 / max 10):
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
                    placeholder="Dodaj ključne fraze (ENTER ili ,)"
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
                Koristi pojmove iz baštovanstva: npr. saksija, supstrat,
                đubrivo, fikus, zalivanje…
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
                Opis proizvoda:
              </Typography>
              <AiButton
                isAiLoading={isAiLoading}
                canGenerate={canGenerate}
                onClick={handleGenerateAiDescription}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <ReactQuill
                ref={quillRef}
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
              Kratak opis proizvoda:{' '}
              <Typography
                component="span"
                variant="caption"
                sx={{ color: 'text.secondary', fontStyle: 'italic' }}
              >
                max 80 karaktera
              </Typography>
            </Typography>
            <OutlinedInput
              name="shortDescription"
              id="shortDescription"
              inputProps={{ maxLength: 80 }}
              placeholder="Unesite kratak opis proizvoda"
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
              Opis se prikazuje na početnoj stranici
            </Typography>

            <Typography htmlFor="price" component="label" sx={labelSx}>
              Cena proizvoda:
            </Typography>
            <Typography
              variant="caption"
              sx={{ mb: 1, color: 'text.secondary', fontStyle: 'italic' }}
            >
              Cenu proizvoda unesite bez tacki i zareza, na nama je da
              formatiramo. e.g. 1490 - 1.490,00 RSD
            </Typography>
            <OutlinedInput
              required
              type="text"
              name="price"
              id="price"
              placeholder="Unesite cenu proizvoda"
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
                Cena: <strong>Na upit</strong>
              </Typography>
            </Box>

            <Typography htmlFor="height" component="label" sx={labelSx}>
              Visina proizvoda:
            </Typography>
            <OutlinedInput
              type="text"
              name="height"
              id="height"
              placeholder="Unesite visinu proizvoda"
              value={product?.height || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="width" component="label" sx={labelSx}>
              Sirina proizvoda:
            </Typography>
            <OutlinedInput
              type="text"
              name="width"
              id="width"
              placeholder="Unesite sirinu proizvoda"
              value={product?.width || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="weight" component="label" sx={labelSx}>
              Tezina proizvoda:
            </Typography>
            <OutlinedInput
              type="text"
              name="weight"
              id="weight"
              placeholder="Unesite tezinu proizvoda"
              value={product?.weight || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />
            <Typography htmlFor="milliliters" component="label" sx={labelSx}>
              Koliko millilitara:
            </Typography>
            <OutlinedInput
              type="text"
              name="milliliters"
              id="milliliters"
              placeholder="Unesite Mililitre"
              value={product?.milliliters || ''}
              onChange={handleChange}
              fullWidth
              disabled={isLoading}
              sx={outlinedInputSx}
            />

            <Button
              type="submit"
              variant="outlined"
              size="large"
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
                'Azuriraj proizvod'
              ) : (
                'Kreiraj proizvod'
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
          Maksimalna veličina fajla je 10MB!
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
    </Box>
  );
};
