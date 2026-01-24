import { Card, CardContent, Typography, Box } from '@mui/material';

export const ProductDescription = ({
  description
}: {
  description: string;
}) => {
  return (
    <Card sx={{ flex: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Opis proizvoda
        </Typography>

        <Box
          className="ql-editor"
          dangerouslySetInnerHTML={{ __html: description ?? '' }}
          sx={{
            lineHeight: 1.6,

            '& ol': {
              paddingLeft: '1.5em'
            },

            /* ORDERED */
            '& li[data-list="ordered"]': {
              listStyleType: 'decimal'
            },

            /* BULLET */
            '& li[data-list="bullet"]': {
              listStyleType: 'disc'
            },

            '& li': {
              marginBottom: '0.25em'
            },

            /* sakrij quill helper span */
            '& .ql-ui': {
              display: 'none'
            }
          }}
        />
      </CardContent>
    </Card>
  );
};
