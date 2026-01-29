import { formatUrl, getGroupLabel } from '@green-world/utils/helpers';
import { User } from '@green-world/utils/types';
import { Avatar, Box, Card, Divider, Stack, Typography } from '@mui/material';

type RenterItemProps = {
  item:
    | User['statistics']['products'][0]
    | User['statistics']['blogs'][0]
    | User['statistics']['actions'][0];
  typeLabel: string;
};

export const TopContent = ({ user }: { user: User }) => {
  const renderItem = ({ item, typeLabel }: RenterItemProps) => (
    <Box key={item.id}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          src={formatUrl(item.image || '')}
          variant="rounded"
          sx={{ width: 44, height: 44 }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography fontSize={14} variant="h6">
            {item.title}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {typeLabel}
          </Typography>
        </Box>

        <Typography variant="h5">{item.viewCounter}</Typography>
      </Stack>

      <Divider sx={{ mt: 1 }} />
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        p: 2.5,
        boxShadow: 1
      }}
    >
      <Typography variant="h4" mb={2}>
        Najgledaniji sadržaj
      </Typography>

      {/* MOST VISITED PRODUCT GROUP */}
      {user.statistics.mostVisitedProductGroup && (
        <Box mb={3}>
          <Typography variant="h5" color="text.secondary" mb={0.5}>
            Najposećenija grupa proizvoda
          </Typography>
          <Typography variant="h5">
            {getGroupLabel(user.statistics.mostVisitedProductGroup)}
          </Typography>
        </Box>
      )}

      {/* MOST VISITED PRODUCT */}
      {user.statistics.mostVisitedProduct && (
        <Card
          sx={{
            position: 'relative',
            overflow: 'visible',
            p: 3,
            height: '100%',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'success.light',
            boxShadow: 'none',
            background: 'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 4
          }}
        >
          <Typography variant="h5" color="text.secondary" mb={1}>
            Top proizvod
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={formatUrl(
                user.statistics.mostVisitedProduct.images?.[0] || ''
              )}
              variant="rounded"
              sx={{ width: 44, height: 44 }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography fontSize={14} variant="h6">
                {user.statistics.mostVisitedProduct.title}
              </Typography>
              {user.statistics.mostVisitedProduct.group && (
                <Typography fontSize={12} color="text.secondary">
                  {getGroupLabel(user.statistics.mostVisitedProduct.group)}
                </Typography>
              )}
            </Box>

            <Typography variant="h5">
              {user.statistics.mostVisitedProduct.viewCounter ?? 0}
            </Typography>
          </Stack>
        </Card>
      )}

      {/* PRODUCTS */}
      <Box mb={3}>
        <Typography variant="h5" mb={1}>
          Proizvodi
        </Typography>
        <Stack spacing={1.5}>
          {user.statistics.products.map((item) =>
            renderItem({ item, typeLabel: 'Proizvod' })
          )}
        </Stack>
      </Box>

      {/* BLOGS */}
      <Box mb={3}>
        <Typography variant="h5" mb={1}>
          Blogovi
        </Typography>
        <Stack spacing={1.5}>
          {user.statistics.blogs.map((item) =>
            renderItem({ item, typeLabel: 'Blog' })
          )}
        </Stack>
      </Box>

      {/* ACTIONS */}
      <Box>
        <Typography variant="h5" mb={1}>
          Aktivnosti
        </Typography>
        <Stack spacing={1.5}>
          {user.statistics.actions.map((item) =>
            renderItem({ item, typeLabel: 'Aktivnost' })
          )}
        </Stack>
      </Box>
    </Box>
  );
};
