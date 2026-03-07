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
import { Copy, EditIcon, Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PopDelete } from '../PopDelete';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate } = useDeletePost(post?._id);

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
          height="300"
          image={formatImageUrl(post.coverImage)}
          onClick={
            location.pathname.includes('/profile')
              ? () => navigate(`/blog/${post._id}`)
              : undefined
          }
          alt={post.title}
          sx={{ objectFit: 'cover', minHeight: 300, maxHeight: 300 }}
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
            .replace(/<[^>]*>/g, '') || t('blogCard.noDescription')}
        </Typography>
      </CardContent>
      <Box
        sx={{
          p: 2,
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
                    toast.success(t('blogCard.linkCopied'));
                  })
                  .catch(() => {
                    alert(t('blogCard.linkCopyFailed'));
                  });
              }}
            >
              <Copy />
            </IconButton>

            <PopDelete
              key="delete"
              title={t('blogCard.deleteTitle')}
              description={t('blogCard.deleteDescription')}
              okText={t('blogCard.yes')}
              cancelText={t('blogCard.no')}
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
