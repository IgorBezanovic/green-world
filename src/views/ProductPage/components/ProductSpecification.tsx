import { Product } from '@green-world/utils/types';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface ProductSpecificationProps {
  product: Product | undefined;
}

export const ProductSpecification = ({
  product
}: ProductSpecificationProps) => {
  const hasSpecifications =
    !!product?.height ||
    !!product?.width ||
    !!product?.weight ||
    !!product?.milliliters;

  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ marginBottom: 2 }}>
          Specifikacije
        </Typography>
        {hasSpecifications ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {product?.height && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}
              >
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Visina:
                </Box>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {product.height}
                </Box>
              </Box>
            )}
            {product?.width && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}
              >
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Širina:
                </Box>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {product.width}
                </Box>
              </Box>
            )}
            {product?.weight && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}
              >
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Težina:
                </Box>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {product.weight}
                </Box>
              </Box>
            )}
            {product?.milliliters && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem'
                }}
              >
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  Količina tečnosti:
                </Box>
                <Box component="span" sx={{ fontWeight: 500 }}>
                  {product.milliliters} ml
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2">Nema unetih specifikacija</Typography>
        )}
      </CardContent>
    </Card>
  );
};
