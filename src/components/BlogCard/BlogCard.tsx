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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { DeleteConfirmDialog } from '../DeleteConfirmDialog';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate, isPending: isDeletingPost } = useDeletePost(post?._id);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCloseDeleteDialog = () => {
    if (isDeletingPost) return;
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

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
              <EditIcon style={{ strokeWidth: '2px' }} />
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
              <Copy style={{ strokeWidth: '2px' }} />
            </IconButton>

            <IconButton
              aria-label="Delete Blog"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash style={{ strokeWidth: '2px' }} />
            </IconButton>
          </CardActions>
        </>
      )}

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        title={t('blogCard.deleteTitle')}
        description={t('blogCard.deleteDescription')}
        cancelText={t('blogCard.no')}
        confirmText={t('blogCard.yes')}
        onCancel={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingPost}
      />
    </Card>
  );
};
