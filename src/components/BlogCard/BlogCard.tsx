'use client';

import { useDeletePost } from '@green-world/hooks/useDeletePost';
import { formatImageUrl } from '@green-world/utils/helpers';
import { slugOrId } from '@green-world/utils/slug';
import { BlogPost } from '@green-world/utils/types';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  IconButton,
  Divider,
  Tooltip
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
          : () => navigate(`/blog/${slugOrId(post)}`)
      }
    >
      {post.coverImage && (
        <CardMedia
          component="img"
          height="300"
          image={formatImageUrl(post.coverImage)}
          onClick={
            location.pathname.includes('/profile')
              ? () => navigate(`/blog/${slugOrId(post)}`)
              : undefined
          }
          alt={post.title}
          sx={{ objectFit: 'cover', minHeight: 300, maxHeight: 300 }}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Tooltip title={post.title} arrow>
          <Typography
            variant="h3"
            fontWeight={500}
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              minHeight: '1.4em'
            }}
          >
            {post.title}
          </Typography>
        </Tooltip>
        <Divider variant="fullWidth" />
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5rem',
            paddingTop: '8px'
          }}
        >
          {post.blocks
            ?.find((b: any) => b.type === 'text')
            ?.text?.replace(/<[^>]*>/g, '') || t('common.noDescription')}
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
              onClick={() => navigate(`/write-post/${slugOrId(post)}`)}
            >
              <EditIcon style={{ strokeWidth: '2px' }} />
            </IconButton>
            <IconButton
              aria-label="Share Product"
              onClick={() => {
                navigator.clipboard
                  .writeText(`https://www.zelenisvet.rs/blog/${slugOrId(post)}`)
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
