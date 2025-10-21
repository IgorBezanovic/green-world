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
          ? 'Cena Na Upit'
          : `${productData?.price.toLocaleString()},00 RSD`,
        productId: productData._id
      }));
    }
  }, [productData]);

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
          message: 'Proizvod je uspešno poručen',
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
          message: 'Greška prilikom poručivanja',
          severity: 'error'
        });
      }
    });
  };

  const metaObj = useMemo(
    () => ({
      title: productData
        ? ['Zeleni svet', productData.title, 'Proizvod']
            .filter(Boolean)
            .join(' | ')
        : 'Zeleni svet | proizvod',
      description: productData?.description || 'Proizvod Zeleni Svet',
      image:
        formatImageUrl(productData?.images[0] || '') ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [productData]
  );
  if (!productId) return <></>;

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Proizvodi', route: '/search' },
    { label: productData?.title || 'Proizvod', route: `/product/${productId}` },
    {
      label: `Poruči proizvod`,
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
            Poruči proizvod
          </Typography>
          <Typography variant="body1">
            Popunite formu ispod i poslaćemo Vam potvrdu na email
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
                Podaci o proizvodu
              </Typography>
              <Typography variant="body2">
                Informacije o proizvodu se automatski popunjavaju
              </Typography>
            </Box>
          </Box>
          <Box className="grid gap-4 md:grid-cols-2 mb-4">
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="productName">
                Naziv proizvoda *
              </Box>
              <OutlinedInput
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Npr. Zelena biljka"
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
                Cena proizvoda *
              </Box>
              <OutlinedInput
                id="productPrice"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleInputChange}
                placeholder="Npr. 2500 RSD"
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
              Količina / Napomena *
            </Box>
            <OutlinedInput
              id="productQuantity"
              name="productQuantity"
              value={formData.productQuantity}
              onChange={handleInputChange}
              disabled={isSubmitting}
              error={Boolean(errors.productQuantity)}
              placeholder="Npr. 1kom ili Želim dva buketa"
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
                Podaci za dostavu
              </Typography>
              <Typography variant="body2">
                Unesite vaše kontakt informacije i adresu za dostavu
              </Typography>
            </Box>
          </Box>
          <Box
            className="grid gap-4 md:grid-cols-2"
            sx={{ marginBottom: '16px' }}
          >
            <Box className="space-y-2 flex flex-col">
              <Box component="label" htmlFor="name">
                Ime *
              </Box>
              <OutlinedInput
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.name)}
                placeholder="Vaše ime"
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
                Prezime *
              </Box>
              <OutlinedInput
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.lastName)}
                placeholder="Vaše prezime"
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
                helperText={errors.email ? 'Unesite validan email' : ''}
                placeholder="vaš@email.com"
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
                Telefon *
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
              Adresa *
            </Box>
            <OutlinedInput
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isSubmitting}
              error={Boolean(errors.address)}
              placeholder="Ulica i broj"
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
                Grad *
              </Box>
              <OutlinedInput
                id="city"
                name="city"
                value={formData.city}
                error={Boolean(errors.city)}
                onChange={handleInputChange}
                disabled={isSubmitting}
                placeholder="Npr. Beograd"
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
                Poštanski broj *
              </Box>
              <OutlinedInput
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                disabled={isSubmitting}
                error={Boolean(errors.postalCode)}
                placeholder="Npr. 11000"
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
              Napomena (opciono)
            </Box>
            <OutlinedInput
              multiline
              id="message"
              name="message"
              value={formData.message}
              disabled={isSubmitting}
              onChange={handleInputChange}
              placeholder="Dodatne informacije o porudžbini..."
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
                Slanje...
              </>
            ) : (
              'Pošalji porudžbinu'
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
