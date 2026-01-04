import { useDeletePost } from '@green-world/hooks/useDeletePost';
import { formatImageUrl } from '@green-world/utils/helpers';
import { BlogPost } from '@green-world/utils/types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  IconButton,
  Divider
} from '@mui/material';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PopDelete } from '../PopDelete';

interface BlogCardProps {
  post: BlogPost;
  blogsRefetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<BlogPost[], Error>>;
}

export const BlogCard = ({ post, blogsRefetch }: BlogCardProps) => {
  const navigate = useNavigate();
  const { mutate } = useDeletePost(post?._id, {
    onSuccess: () => {
      if (blogsRefetch) {
        blogsRefetch();
      }
    }
  });

  return (
    <Card
      key={post._id}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={
        location.pathname.includes('/profile')
          ? undefined
          : () => navigate(`/blog/${post._id}`)
      }
    >
      {post.coverImage && (
        <CardMedia
          component="img"
          height="200"
          image={formatImageUrl(post.coverImage)}
          onClick={
            location.pathname.includes('/profile')
              ? () => navigate(`/blog/${post._id}`)
              : undefined
          }
          alt={post.title}
          sx={{ objectFit: 'cover', minHeight: 200 }}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.blocks
            .find((b: any) => b.type === 'text')
            ?.text?.substring(0, 100)
            .replace(/<[^>]*>/g, '') || 'Nema opisa...'}
        </Typography>
      </CardContent>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="caption">
          {post.author} {' • '}{' '}
          {new Date(post.createdAt).toLocaleDateString('sr-RS')}
        </Typography>
      </Box>
      {location.pathname.includes('/profile') && (
        <>
          <Divider />
          <CardActions disableSpacing sx={{ justifyContent: 'space-around' }}>
            <IconButton
              aria-label="Edit Product"
              onClick={() => navigate(`/write-post/${post._id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Share Product"
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://www.zelenisvet.rs/blog/${post._id}`)
                  .then(() => {
                    toast.success('Kopiran link');
                  })
                  .catch(() => {
                    alert('Neuspešno kopiranje linka');
                  });
              }}
            >
              <Copy />
            </IconButton>

            <PopDelete
              key="delete"
              title={'Brisanje Boga'}
              description={'Da li ste sigurni da želite da obrišete bog?'}
              okText={'Da'}
              cancelText={'Ne'}
              id={post._id}
              mutate={mutate}
            >
              <IconButton aria-label="Delete Product">
                <Trash />
              </IconButton>
            </PopDelete>
          </CardActions>
        </>
      )}
    </Card>
  );
};
