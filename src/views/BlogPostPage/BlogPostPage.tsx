import {
  Loader,
  BlogBlock,
  BookmarkButton,
  VoteButtons,
  CommentForm,
  CommentList,
  ZSLogoLogoMark,
  AppBreadcrumbs,
  MetaTags,
  UserInfo
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import useBlogPost from '@green-world/hooks/useBlogPost';
import { useCreateComment } from '@green-world/hooks/useCreateComment';
import { useUser } from '@green-world/hooks/useUser';
import { useVotePost } from '@green-world/hooks/useVotePost';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Box, Card, Chip, useTheme } from '@mui/material';
import { Calendar, Clock, Copy, User } from 'lucide-react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const BlogPostPage = () => {
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
      'Nepoznati korisnik';

    try {
      createComment({ postId, text, parentComment, author });
      refetch();
    } catch (e) {
      console.error('Create comment failed', e);
    }
  };

  if (loading || userLoading) return <Loader />;
  if (error)
    return (
      <div className="p-8 text-red-600">
        Error: {(error as any)?.message || String(error)}
      </div>
    );

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Blog', route: '/blog' },
    { label: post?.title || '', route: `/blog/${post?._id}` }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni svet | Blog'} />

      <div className="xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 xl:px-0 py-7">
        <AppBreadcrumbs pages={pages} />
      </div>
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
        <section className="w-full md:w-3/4 flex flex-col gap-5">
          {post?.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3 mt-4">
              <ZSLogoLogoMark
                color={theme.palette.secondary.main}
                width="24px"
                height="42spx"
              />
              {post.keywords?.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  variant="outlined"
                  color="secondary"
                />
              ))}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>

          <Box
            sx={{
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
            }}
          >
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <User />
              {post?.author}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar />
              {new Date(post?.createdAt || '').toLocaleDateString()}
            </div>
            {post?.timeOfReading && (
              <div className="flex items-center gap-1 flex flex-wrap gap-2 text-sm text-gray-500">
                <Clock />
                {post.timeOfReading} min čitanja
              </div>
            )}
          </Box>

          {post?.coverImage && (
            <img
              src={formatImageUrl(post?.coverImage || '')}
              alt={post?.title}
              className="w-full rounded mb-4 max-h-[500px] object-cover"
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
                    <div
                      key={`img-group-${imgs[0]?._id || i}`}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                    >
                      {imgs?.map((imgBlock) => (
                        <img
                          key={imgBlock._id}
                          src={formatImageUrl(imgBlock.image || '')}
                          alt={imgBlock.text || ''}
                          className="w-full rounded"
                        />
                      ))}
                    </div>
                  );
                } else {
                  elements.push(<BlogBlock key={b._id} block={b} />);
                }
              }

              return elements;
            })()}
          </div>

          <Box
            sx={{
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
            }}
          >
            <VoteButtons
              likes={post?.likes}
              dislikes={post?.dislikes}
              onVote={handlePostVote}
            />
            <Chip
              aria-label="share"
              variant="outlined"
              color="secondary"
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://www.zelenisvet.rs/blog/${post?._id}`)
                  .then(() => {
                    toast.success('Kopiran link');
                  })
                  .catch(() => {
                    alert('Neuspešno kopiranje linka');
                  });
              }}
              label={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Copy /> Podeli Blog
                </Box>
              }
            />
            <BookmarkButton />
          </Box>

          <Card sx={{ mt: 4, p: 2 }}>
            <h2 className="text-xl font-semibold mb-3">Ostavite komentar</h2>
            <CommentForm onSubmit={handleAddComment} />
            <CommentList
              comments={post?.comments || []}
              onReply={handleAddComment}
            />
          </Card>
        </section>
        <section className="w-full md:w-1/4 flex flex-col gap-2 sticky">
          <h2 className="text-2xl font-bold mb-4">O Autoru:</h2>
          <UserInfo
            user={sellerData}
            isUserProfile={false}
            userLoading={userLoading}
            customStyleMeta={['flex', 'flex-col']}
          />
        </section>
      </Box>
    </Box>
  );
};
