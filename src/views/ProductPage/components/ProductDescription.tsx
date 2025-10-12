import { Card, CardContent, Typography } from '@mui/material';

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription = ({
  description
}: ProductDescriptionProps) => {
  return (
    <Card sx={{ flex: 2 }}>
      <CardContent className="p-8">
        <Typography variant="h2" sx={{ marginBottom: 2 }}>
          Opis proizvoda
        </Typography>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: description ?? ''
          }}
        />
      </CardContent>
    </Card>
  );
};
