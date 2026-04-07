'use client';

import {
  AppBreadcrumbs,
  BlogCard,
  ItemsHero,
  MetaTags,
  SharedPagination,
  SocialMedia
} from '@green-world/components';
import { useAllBlogPosts } from '@green-world/hooks/useAllBlogPosts';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { User } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export const BlogPost = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = useMemo(
    () => ({
      page: Math.max(Number(searchParams.get('page') || 1), 1),
      titleSearch: searchParams.get('titleSearch') ?? '',
      authorSearch: searchParams.get('authorSearch') ?? ''
    }),
    [searchParams]
  );

  const [titleSearch, setTitleSearch] = useState(urlState.titleSearch);
  const [authorSearch, setAuthorSearch] = useState(urlState.authorSearch);

  const debouncedTitle = useDebounce(titleSearch, 300);
  const debouncedAuthor = useDebounce(authorSearch, 300);

  const currentPage = urlState.page;

  useEffect(() => {
    if (titleSearch !== urlState.titleSearch)
      setTitleSearch(urlState.titleSearch);
    if (authorSearch !== urlState.authorSearch)
      setAuthorSearch(urlState.authorSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (debouncedTitle) next.set('titleSearch', debouncedTitle);
    if (debouncedAuthor) next.set('authorSearch', debouncedAuthor);
    if (currentPage > 1) next.set('page', String(currentPage));
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedAuthor, currentPage]);

  const {
    data: postsResponse,
    isLoading,
    isError
  } = useAllBlogPosts({
    page: currentPage,
    titleSearch: debouncedTitle || undefined,
    authorSearch: debouncedAuthor || undefined
  });
  const posts = postsResponse?.data || [];
  const postsMeta = postsResponse?.meta;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.blog'), route: '/blog' }
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
        title={t('seo.blog.title')}
        description={t('seo.blog.description')}
        keywords={t('seo.blog.keywords')}
      />

      <ItemsHero
        kicker={t('blogView.hero.kicker')}
        title={t('blogView.hero.title')}
        subtitle={t('blogView.hero.subtitle')}
        searchPlaceholder={t('blogView.hero.titlePlaceholder')}
        searchValue={titleSearch}
        onSearchChange={(value) => {
          setTitleSearch(value);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (value) next.set('titleSearch', value);
              else next.delete('titleSearch');
              next.delete('page');
              return next;
            },
            { replace: true }
          );
        }}
        secondFieldPlaceholder={t('blogView.hero.authorPlaceholder')}
        secondFieldValue={authorSearch}
        onSecondFieldChange={(value) => {
          setAuthorSearch(value);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              if (value) next.set('authorSearch', value);
              else next.delete('authorSearch');
              next.delete('page');
              return next;
            },
            { replace: true }
          );
        }}
        secondFieldIcon={User}
      />

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

        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && (
          <Typography variant="body1" color="common.black">
            {postsMeta?.totalItems ?? posts.length} rezultata pronađeno
          </Typography>
        )}

        {posts.length > 0 && (
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

        <SharedPagination
          totalPages={postsMeta?.pages}
          currentPage={postsMeta?.currentPage ?? currentPage}
          isLoading={isLoading}
          isError={isError}
          isMobile={isMobile}
          onPageChange={(value) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (value > 1) {
                next.set('page', String(value));
              } else {
                next.delete('page');
              }
              return next;
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <Box
          sx={(theme) => ({
            mt: 8,
            borderRadius: 3,
            padding: 4,
            [theme.breakpoints.up('md')]: {
              padding: 6
            },
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
              {t('blogView.ctaTitle')}
            </Typography>

            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              {t('blogView.ctaSubtitle')}
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
              {t('blogView.writeBlog')}
              <ArrowRight style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        </Box>

        {posts.length === 0 && !isLoading && (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              {t('blogView.noPostsTitle')}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/write-post')}
            >
              {t('blogView.writeFirstPost')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
