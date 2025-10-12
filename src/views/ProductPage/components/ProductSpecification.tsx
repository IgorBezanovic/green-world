import { Product } from '@green-world/utils/types';
import { Card, CardContent, Typography } from '@mui/material';

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
      <CardContent className="p-6">
        <Typography variant="h2" sx={{ marginBottom: 2 }}>
          Specifikacije
        </Typography>
        {hasSpecifications ? (
          <div className="space-y-3">
            {product?.height && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Visina:</span>
                <span className="font-medium">{product.height}</span>
              </div>
            )}
            {product?.width && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Širina:</span>
                <span className="font-medium">{product.width}</span>
              </div>
            )}
            {product?.weight && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Težina:</span>
                <span className="font-medium">{product.weight}</span>
              </div>
            )}
            {product?.milliliters && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Količina tečnosti:
                </span>
                <span className="font-medium">{product.milliliters} ml</span>
              </div>
            )}
          </div>
        ) : (
          <Typography variant="body2">Nema unetih specifikacija</Typography>
        )}
      </CardContent>
    </Card>
  );
};
