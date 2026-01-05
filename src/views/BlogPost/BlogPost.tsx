import {
  AppBreadcrumbs,
  BlogCard,
  MetaTags,
  SocialMedia
} from '@green-world/components';
import { useAllBlogPosts } from '@green-world/hooks/useAllBlogPosts';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Divider
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export const BlogPost = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useAllBlogPosts();
  const theme = useTheme();

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Blog', route: '/blog' }
  ];

  return (
    <Box className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Blog'} />
      <Box
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />

        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ mb: 12, textAlign: 'center' }}>
          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <Divider sx={{ height: 1.5, width: 48, bgcolor: 'primary.main' }} />
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                px: 1.5,
                py: 0.25
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                  fontFamily: 'Ephesis',
                  color: 'secondary.main'
                }}
              >
                Zeleni Svet Blog
              </Typography>
            </Box>
            <Divider sx={{ height: 1.5, width: 48, bgcolor: 'primary.main' }} />
          </Box>

          <Typography
            component="h1"
            sx={{
              mb: 2,
              fontFamily: 'Ephesis',
              fontWeight: 700,
              color: 'secondary.main',
              fontSize: { xs: '2.25rem', sm: '3rem', lg: '3.75rem' }
            }}
          >
            Priče iz Naše Bašte
          </Typography>

          <Typography
            sx={{
              mx: 'auto',
              maxWidth: 800,
              fontSize: '1.125rem'
            }}
          >
            Otkrijte inspiraciju, biljke i filozofiju iza svake biljke koju
            gajimo sa ljubavlju i pažnjom.
          </Typography>
        </Box>

        {posts && posts.length > 0 && (
          <Box
            sx={(theme) => ({
              display: 'grid',
              gap: theme.spacing(3),
              gridTemplateColumns: 'repeat(1, 1fr)',
              [theme.breakpoints.up('xs')]: {
                gridTemplateColumns: 'repeat(2, 1fr)'
              },
              [theme.breakpoints.up('md')]: {
                gridTemplateColumns: 'repeat(4, 1fr)'
              }
            })}
          >
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </Box>
        )}
        <Box
          sx={(theme) => ({
            mt: 8,
            borderRadius: 3,
            p: { xs: 4, lg: 6 },
            textAlign: 'center',
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              0.1
            )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 50%, ${alpha(
              theme.palette.info?.main ?? theme.palette.error.main,
              0.08
            )} 100%)`
          })}
        >
          <Box sx={{ mx: 'auto', maxWidth: 800 }}>
            <Typography
              component="h2"
              variant="h2"
              sx={{ mb: 2, color: 'text.primary' }}
            >
              Želite Više Informacija?
            </Typography>

            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              Pridružite se našoj zajednici i budite prvi koji će saznati za
              nove biljke, priče i događaje.
            </Typography>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <SocialMedia
                color={theme.palette.secondary.main}
                isAppData={true}
                size={'24px'}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/write-post')}
            >
              Napiši Blog
              <ArrowRight style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </Box>

        {posts && posts.length === 0 && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              Nema objavljenih postova
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/write-post')}
            >
              Napiši prvi post
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
