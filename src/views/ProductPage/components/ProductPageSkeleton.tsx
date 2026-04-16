import { Box, Card, CardContent, Divider, Skeleton } from '@mui/material';

export const ProductPageSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      width: '100%'
    }}
  >
    {/* ── Top section: image gallery + product info ── */}
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: { flexDirection: 'row' },
        gap: 4
      })}
    >
      {/* ImageGallery skeleton */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2
        }}
      >
        {/* Main image */}
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            minHeight: 460,
            aspectRatio: '1 / 1',
            borderRadius: '6px'
          }}
        />
        {/* Thumbnails */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={72}
              height={72}
              sx={{ borderRadius: 1, flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>

      {/* Right column */}
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
        {/* Title – matches h1 ~3rem cursive */}
        <Skeleton variant="text" height={72} width="80%" sx={{ mb: 0.5 }} />

        {/* Category chips */}
        <Box sx={{ mt: 1, mb: 3, display: 'flex', gap: 1 }}>
          <Skeleton variant="rounded" height={24} width={90} />
          <Skeleton variant="rounded" height={24} width={110} />
        </Box>

        {/* Short description */}
        <Skeleton variant="text" height={20} width="100%" />
        <Skeleton variant="text" height={20} width="88%" />

        {/* Price + stock */}
        <Box sx={{ display: 'flex', gap: 2, my: 5, alignItems: 'center' }}>
          <Skeleton variant="text" height={52} width={160} />
          <Skeleton variant="text" height={28} width={110} />
        </Box>

        {/* Direct contact / no commission / user support */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Skeleton variant="text" height={24} width={130} />
          <Skeleton variant="text" height={24} width={115} />
          <Skeleton variant="text" height={24} width={125} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Seller card */}
        <Card>
          <CardContent sx={{ padding: '24px' }}>
            {/* Avatar + name */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Skeleton
                variant="circular"
                width={64}
                height={64}
                sx={{ flexShrink: 0 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton
                  variant="text"
                  height={28}
                  width="70%"
                  sx={{ mb: 0.5 }}
                />
                <Skeleton variant="text" height={20} width="55%" />
                <Skeleton variant="text" height={20} width="45%" />
              </Box>
            </Box>

            <Divider sx={{ marginY: 2 }} />

            {/* Phone + email */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Skeleton variant="text" height={24} width="52%" />
              <Skeleton variant="text" height={24} width="62%" />
            </Box>

            {/* Profile + Navigacija buttons */}
            <Box
              sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mt: 2,
                [theme.breakpoints.up('sm')]: { flexDirection: 'row' }
              })}
            >
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
            </Box>
          </CardContent>
        </Card>

        {/* Send message + Order buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Skeleton variant="rounded" height={36} width="100%" />
          <Skeleton variant="rounded" height={36} width="100%" />
        </Box>

        {/* Vote / copy / bookmark row */}
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            my: 3,
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: { flexDirection: 'row' }
          })}
        >
          <Skeleton variant="rounded" height={36} width={120} />
          <Skeleton variant="rounded" height={36} width={36} />
          <Skeleton variant="rounded" height={36} width={36} />
        </Box>
      </Box>
    </Box>

    {/* ── Description + Specification ── */}
    <Box
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: { flexDirection: 'row' },
        gap: 4,
        marginTop: 4
      })}
    >
      {/* ProductDescription (flex: 2) */}
      <Card sx={{ flex: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Skeleton variant="text" height={36} width="40%" sx={{ mb: 2 }} />
          {[100, 95, 90, 88, 94, 72].map((w, i) => (
            <Skeleton key={i} variant="text" height={20} width={`${w}%`} />
          ))}
        </CardContent>
      </Card>

      {/* ProductSpecification (flex: 1) */}
      <Card sx={{ flex: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="text" height={36} width="60%" sx={{ mb: 2 }} />
          {[0, 1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.75
              }}
            >
              <Skeleton variant="text" height={20} width="42%" />
              <Skeleton variant="text" height={20} width="30%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>

    {/* ── Reviews card ── */}
    <Card sx={{ mt: 4, p: 2 }}>
      <Skeleton variant="text" height={36} width="30%" sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
    </Card>
  </Box>
);
