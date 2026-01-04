import {
  Loader,
  BlogBlock,
  VoteButtons,
  CommentForm,
  CommentList,
  ZSLogoLogoMark
} from '@green-world/components';
import { formatImageUrl } from '@green-world/utils/helpers';
import { Box, Card, Chip, useTheme } from '@mui/material';
import { Calendar, Clock, Copy, User } from 'lucide-react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import UserContext from '../../context/UserContext';
import useBlogPost from '../../hooks/useBlogPost';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useVotePost } from '../../hooks/useVotePost';

export const BlogPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const {
    data: post,
    isLoading: loading,
    error,
    refetch
  } = useBlogPost(postId);
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

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="p-8 text-red-600">
        Error: {(error as any)?.message || String(error)}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {post?.keywords && post.keywords.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          <ZSLogoLogoMark
            color={theme.palette.secondary.main}
            width="24px"
            height="42spx"
          />
          {post.keywords.map((kw) => (
            <Chip key={kw} label={kw} variant="outlined" color="secondary" />
          ))}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-6">{post?.title}</h1>

      <div className="flex items-center mb-6 gap-3">
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
      </div>

      {post?.coverImage && (
        <img
          src={formatImageUrl(post?.coverImage || '')}
          alt={post?.title}
          className="w-full rounded mb-4"
        />
      )}

      <div>
        {post?.blocks?.map((b) => (
          <BlogBlock key={b._id} block={b} />
        ))}
      </div>

      <Box sx={{ display: 'flex', gap: 4, my: 8, alignItems: 'center' }}>
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
      </Box>

      <Card sx={{ mt: 6, p: 2 }}>
        <h2 className="text-xl font-semibold mb-3">Ostavite komentar</h2>
        <CommentForm onSubmit={handleAddComment} />
        <CommentList
          comments={post?.comments || []}
          onReply={handleAddComment}
        />
      </Card>
    </div>
  );
};
