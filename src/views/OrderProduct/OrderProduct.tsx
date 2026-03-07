import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useOrderProduct } from '@green-world/hooks/useOrderProduct';
import { useProduct } from '@green-world/hooks/useProduct';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Box,
  Card,
  Divider,
  Typography,
  useTheme,
  OutlinedInput,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Loader2, Package, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

export interface OrderFormData {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  message: string;

  productName: string;
  productPrice: string;
  productQuantity: string;
  productId: string;
}

export const OrderProduct = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { productId } = useParams();
  const { mutate } = useOrderProduct();
  const navigate = useNavigate();
  const { data: productData, isLoading: productLoading } = useProduct(
    productId!
  );
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    message: '',
    productName: '',
    productPrice: '',
    productQuantity: '',
    productId: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    const requiredFields = [
      'productQuantity',
      'name',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
      'postalCode'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof OrderFormData]?.trim()) {
        newErrors[field] = true;
      }
    });

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (productData) {
      setFormData((prev) => ({
        ...prev,
        productName: productData.title,
        productPrice: productData.priceOnRequest
          ? t('orderProductView.priceOnRequest')
          : `${productData?.price.toLocaleString()},00 RSD`,
        productId: productData._id
      }));
    }
  }, [productData, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    mutate(formData, {
      onSuccess: () => {
        setIsSubmitting(false);
        setSnackbar({
          open: true,
          message: t('orderProductView.snackbar.success'),
          severity: 'success'
        });
        setTimeout(() => {
          navigate(`/product/${productId}`);
        }, 2000);
      },
      onError: () => {
        setIsSubmitting(false);
        setSnackbar({
          open: true,
          message: t('orderProductView.snackbar.error'),
          severity: 'error'
        });
      }
    });
  };

  const metaObj = useMemo(
    () => ({
      title: productData
        ? ['Zeleni svet', productData.title, t('seo.product.label')]
            .filter(Boolean)
            .join(' | ')
        : t('orderProductView.metaFallbackTitle'),
      description:
        productData?.description ||
        t('orderProductView.metaFallbackDescription'),
      image:
        formatImageUrl(productData?.images[0] || '') ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [productData, t]
  );
  if (!productId) return <></>;

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.products'), route: '/search' },
    {
      label: productData?.title || t('productPage.productFallback'),
      route: `/product/${productId}`
    },
    {
      label: t('orderProductView.breadcrumb'),
      route: `/order-product/${productId}`
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
      <MetaTags
        title={metaObj.title}
        description={metaObj.description}
        keywords={metaObj.description}
        image={metaObj.image}
      />
      <Box
        sx={{
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
        }}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider />
        <Box className="mb-8 text-center">
          <Typography
            variant="h1"
            sx={{
              fontSize: '3.75rem !important',
              [theme.breakpoints.down('md')]: {
                fontSize: '3rem !important'
              },
              fontFamily: 'Ephesis',
              marginBottom: '16px',
              color: 'secondary.main'
            }}
          >
            {t('orderProductView.title')}
          </Typography>
          <Typography variant="body1">
            {t('orderProductView.subtitle')}
          </Typography>
        </Box>
        <Card
          sx={{
            padding: '24px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            <Box
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              1
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Package />
                {t('orderProductView.sections.productData.title')}
              </Typography>
              <Typography variant="body2">
                {t('orderProductView.sections.productData.subtitle')}
              </Typography>
            </Box>
          </Box>
          <Box className="grid gap-4 md:grid-cols-2 mb-4">
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="productName">
                {t('orderProductView.fields.productName')}
              </Box>
              <OutlinedInput
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder={t('orderProductView.placeholders.productName')}
                required
                disabled
                endAdornment={
                  productLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null
                }
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important',
                    cursor: 'not-allowed'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#f5f5f5',
                    color: '#888',
                    cursor: 'not-allowed'
                  }
                }}
              />
            </Box>
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="productPrice">
                {t('orderProductView.fields.productPrice')}
              </Box>
              <OutlinedInput
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                placeholder={t('orderProductView.placeholders.productPrice')}
                required
                disabled
                endAdornment={
                  productLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ) : null
                }
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important',
                    cursor: 'not-allowed'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#f5f5f5',
                    color: '#888',
                    cursor: 'not-allowed'
                  }
                }}
              />
            </Box>
          </Box>
          <Box className="space-y-2 flex flex-col">
            <Box component="label" htmlFor="kolicinaProizvoda">
              {t('orderProductView.fields.quantityNote')}
            </Box>
            <OutlinedInput
              id="productQuantity"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={handleInputChange}
              disabled={isSubmitting}
              error={Boolean(errors.productQuantity)}
              placeholder={t('orderProductView.placeholders.quantityNote')}
              required
              sx={{
                '& .MuiOutlinedInput-input': {
                  padding: '8px !important'
                }
              }}
            />
          </Box>
        </Card>
        <Card
          sx={{
            padding: '24px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}
          >
            <Box
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              2
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {t('orderProductView.sections.delivery.title')}
              </Typography>
              <Typography variant="body2">
                {t('orderProductView.sections.delivery.subtitle')}
              </Typography>
            </Box>
          </Box>
          <Box
            className="grid gap-4 md:grid-cols-2"
            sx={{ marginBottom: '16px' }}
          >
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="name">
                {t('orderProductView.fields.firstName')}
              </Box>
              <OutlinedInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.name)}
                placeholder={t('orderProductView.placeholders.firstName')}
                required
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="lastName">
                {t('orderProductView.fields.lastName')}
              </Box>
              <OutlinedInput
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.lastName)}
                placeholder={t('orderProductView.placeholders.lastName')}
                required
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
          </Box>

          <Box
            className="grid gap-4 md:grid-cols-2"
            sx={{ marginBottom: '16px' }}
          >
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="email">
                Email *
              </Box>
              <TextField
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.email)}
                helperText={
                  errors.email ? t('orderProductView.invalidEmail') : ''
                }
                placeholder={t('orderProductView.placeholders.email')}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="phone">
                {t('orderProductView.fields.phone')}
              </Box>
              <OutlinedInput
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.phone)}
                placeholder="+381 60 123 4567"
                required
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
          </Box>

          <Box
            className="space-y-2 flex flex-col"
            sx={{ marginBottom: '16px' }}
          >
            <Box component="label" htmlFor="address">
              {t('orderProductView.fields.address')}
            </Box>
            <OutlinedInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isSubmitting}
              error={Boolean(errors.address)}
              placeholder={t('orderProductView.placeholders.address')}
              required
              sx={{
                '& .MuiOutlinedInput-input': {
                  padding: '8px !important'
                }
              }}
            />
          </Box>

          <Box
            className="grid gap-4 md:grid-cols-2"
            sx={{ marginBottom: '16px' }}
          >
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="city">
                {t('orderProductView.fields.city')}
              </Box>
              <OutlinedInput
                id="city"
                name="city"
                value={formData.city}
                error={Boolean(errors.city)}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder={t('orderProductView.placeholders.city')}
                required
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="postalCode">
                {t('orderProductView.fields.postalCode')}
              </Box>
              <OutlinedInput
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.postalCode)}
                placeholder={t('orderProductView.placeholders.postalCode')}
                required
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '8px !important'
                  }
                }}
              />
            </Box>
          </Box>

          <Box className="space-y-2 flex flex-col">
            <Box component="label" htmlFor="message">
              {t('orderProductView.fields.message')}
            </Box>
            <OutlinedInput
              multiline
              id="message"
              name="message"
              value={formData.message}
              disabled={isSubmitting}
              onChange={handleInputChange}
              placeholder={t('orderProductView.placeholders.message')}
              rows={4}
            />
          </Box>
        </Card>
        <Box className="flex justify-center">
          <Button
            variant="contained"
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px]"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('orderProductView.submitting')}
              </>
            ) : (
              t('orderProductView.submit')
            )}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
