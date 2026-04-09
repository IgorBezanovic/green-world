'use client';

import {
  BlogBlock,
  BookmarkButton,
  CopyLinkButton,
  VoteButtons,
  CommentForm,
  CommentList,
  ZSLogoLogoMark,
  AppBreadcrumbs,
  PageCenteredState,
  PageContent,
  UserInfo,
  DeletedItemOverlay
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import useBlogPost from '@green-world/hooks/useBlogPost';
import { useCreateComment } from '@green-world/hooks/useCreateComment';
import { useUser } from '@green-world/hooks/useUser';
import { useVotePost } from '@green-world/hooks/useVotePost';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Box,
  Card,
  Chip,
  Divider,
  Skeleton,
  Typography,
  useTheme
} from '@mui/material';
import { Calendar, Clock, User } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const BlogPostPage = () => {
  const { t } = useTranslation();
  const { postId } = useParams<{ postId: string }>();
  const {
    data: post,
    isLoading: loading,
    error,
    refetch
  } = useBlogPost(postId);
  const { data: sellerData, isLoading: userLoading } = useUser(
    post?.createdBy || ''
  );
  const { mutate: voteMutate } = useVotePost(postId || '');
  const { mutate: createComment } = useCreateComment();
  const { user } = useContext(UserContext);
  const theme = useTheme();

  const handlePostVote = (vote: 'like' | 'dislike' | string) => {
    if (!postId) return;
    voteMutate(
      { vote },
      {
        onSuccess: () => {
          refetch();
        }
      }
    );
  };

  const handleAddComment = (text: string, parentComment?: string | null) => {
    if (!postId) return;

    const author =
      `${user?.name || ''} ${user?.lastname || ''}`.trim() ||
      t('common.unknownUser');

    try {
      createComment({ postId, text, parentComment, author });
      refetch();
    } catch (e) {
      console.error('Create comment failed', e);
    }
  };

  if (loading || userLoading)
    return (
      <PageContent>
        <Box
          sx={(theme) => ({
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            px: '16px',
            py: '1.75rem',
            [theme.breakpoints.up('sm')]: { px: '24px' },
            [theme.breakpoints.up('xl')]: { px: 0 }
          })}
        >
          <Skeleton variant="text" width={280} height={28} />
        </Box>
        <Box
          sx={(theme) => ({
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
            px: '16px',
            gap: 4,
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('sm')]: { px: '1.5rem' },
            [theme.breakpoints.up('xl')]: { px: 0 },
            [theme.breakpoints.up('md')]: { flexDirection: 'row' }
          })}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={70} height={30} />
              <Skeleton variant="rounded" width={90} height={30} />
              <Skeleton variant="rounded" width={60} height={30} />
            </Box>
            <Skeleton variant="text" width="80%" height={52} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="text" width={120} height={28} />
              <Skeleton variant="text" width={100} height={28} />
              <Skeleton variant="text" width={80} height={28} />
            </Box>
            <Divider />
            <Skeleton
              variant="rectangular"
              height={360}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} width="90%" />
            <Skeleton variant="text" height={24} width="75%" />
            <Skeleton variant="text" height={24} />
            <Skeleton variant="text" height={24} width="85%" />
          </Box>
          <Box
            sx={(theme) => ({
              width: '100%',
              [theme.breakpoints.up('md')]: { width: '30%' }
            })}
          >
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mx: 'auto', mb: 2 }}
            />
            <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mb: 3 }} />
            <Skeleton
              variant="rectangular"
              height={120}
              sx={{ borderRadius: 2 }}
            />
          </Box>
        </Box>
      </PageContent>
    );
  if (error)
    return (
      <PageCenteredState>
        <Typography color="error" sx={{ px: 2, textAlign: 'center' }}>
          Error: {(error as any)?.message || String(error)}
        </Typography>
      </PageCenteredState>
    );

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('navbar.blog'), route: '/blog' },
    { label: post?.title || '', route: `/blog/${post?._id}` }
  ];

  return (
    <PageContent>
      {post?.status === 'deleted' && (
        <DeletedItemOverlay
          itemType="blog post"
          creatorId={post?.createdBy}
          creatorNotFound={!userLoading && !sellerData}
        />
      )}
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          [theme.breakpoints.up('sm')]: {
            px: '24px'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
      </Box>
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          gap: 2,
          [theme.breakpoints.up('sm')]: {
            py: '1.75rem',
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.up('md')]: {
            flexDirection: 'row'
          }
        })}
      >
        <Box
          component="section"
          sx={(theme) => ({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            [theme.breakpoints.up('md')]: {
              width: '75%'
            }
          })}
        >
          {post?.keywords && post.keywords.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mb: 0.75,
                mt: 1,
                flexDirection: 'column',
                [theme.breakpoints.up('xs')]: {
                  flexDirection: 'row'
                }
              }}
            >
              <ZSLogoLogoMark
                color={theme.palette.secondary.main}
                width="24px"
                height="42spx"
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap'
                }}
              >
                {post.keywords?.map((kw) => (
                  <Chip
                    key={kw}
                    label={kw}
                    variant="outlined"
                    color="secondary"
                  />
                ))}
              </Box>
            </Box>
          )}
          <Typography variant="h1">{post?.title}</Typography>

          <Box
            sx={(theme) => ({
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              gap: '12px',
              [theme.breakpoints.up('md')]: {
                alignItems: 'center',
                flexDirection: 'row'
              }
            })}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'grey.600'
              }}
            >
              <User />
              {post?.author}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'grey.600'
              }}
            >
              <Calendar />
              {new Date(post?.createdAt || '').toLocaleDateString()}
            </Box>
            {post?.timeOfReading && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  color: 'grey.600'
                }}
              >
                <Clock />
                {post.timeOfReading} {t('blogPostPage.minRead')}
              </Box>
            )}
          </Box>

          {post?.coverImage && (
            <img
              src={formatImageUrl(post?.coverImage || '')}
              alt={post?.title}
              style={{
                width: '100%',
                borderRadius: 4,
                marginBottom: 16,
                maxHeight: 500,
                objectFit: 'cover'
              }}
            />
          )}

          <div>
            {(() => {
              const blocks = post?.blocks || [];
              const elements: any[] = [];
              for (let i = 0; i < blocks.length; i++) {
                const b = blocks[i];

                if (b.type === 'image' && blocks[i + 1]?.type === 'image') {
                  const imgs = [] as typeof blocks;
                  while (i < blocks.length && blocks[i].type === 'image') {
                    imgs.push(blocks[i]);
                    i++;
                  }
                  i--; // adjust for outer for-loop increment

                  elements.push(
                    <Box
                      component="div"
                      key={`img-group-${imgs[0]?._id || i}`}
                      sx={(theme) => ({
                        display: 'grid',
                        gridTemplateColumns: 'repeat(1, 1fr)',
                        gap: 2,
                        mb: 1.5,
                        [theme.breakpoints.up('md')]: {
                          gridTemplateColumns: 'repeat(2, 1fr)'
                        }
                      })}
                    >
                      {imgs?.map((imgBlock) => (
                        <img
                          key={imgBlock._id}
                          src={formatImageUrl(imgBlock.image || '')}
                          alt={imgBlock.text || ''}
                          style={{ width: '100%', borderRadius: 4 }}
                        />
                      ))}
                    </Box>
                  );
                } else {
                  elements.push(<BlogBlock key={b._id} block={b} />);
                }
              }

              return elements;
            })()}
          </div>

          <Box
            sx={(theme) => ({
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              marginBottom: '16px',
              gap: '12px',
              [theme.breakpoints.up('md')]: {
                alignItems: 'center',
                flexDirection: 'row'
              }
            })}
          >
            <VoteButtons
              likes={post?.likes}
              dislikes={post?.dislikes}
              onVote={handlePostVote}
            />
            <CopyLinkButton
              successMessage={t('blogPostPage.linkCopied')}
              errorMessage={t('blogPostPage.linkCopyFailed')}
            />
            <BookmarkButton />
          </Box>

          <Card sx={{ mt: 4, p: 2 }}>
            <Typography
              variant="h4"
              sx={{ fontSize: '1.25rem', fontWeight: 600, mb: 0.75 }}
            >
              {t('blogPostPage.leaveComment')}
            </Typography>
            <CommentForm onSubmit={handleAddComment} />
            <CommentList
              comments={post?.comments || []}
              onReply={handleAddComment}
            />
          </Card>
        </Box>
        <Box
          component="section"
          sx={(theme) => ({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            [theme.breakpoints.up('md')]: {
              width: '25%'
            },
            position: 'sticky'
          })}
        >
          <Typography variant="h2" sx={{ mb: 1 }}>
            {t('blogPostPage.aboutAuthor')}
          </Typography>
          <UserInfo
            user={sellerData}
            isUserProfile={false}
            userLoading={userLoading}
          />
        </Box>
      </Box>
    </PageContent>
  );
};
