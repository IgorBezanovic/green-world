import { Comment } from '@green-world/utils/types';
import { ProductReviewForm } from '@green-world/views/ProductPage/components/ProductReviewForm';
import {
  Avatar,
  Box,
  Button,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProductReviewItemProps = {
  comment: Comment;
  replies?: Comment[];
  canReply: boolean;
  replyDisabledReason?: string;
  onReply: (
    data: { title?: string; text: string; image?: string },
    parentComment?: string | null
  ) => Promise<void> | void;
};

export const ProductReviewItem = ({
  comment,
  replies = [],
  canReply,
  replyDisabledReason,
  onReply
}: ProductReviewItemProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showReply, setShowReply] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
        <Avatar sx={{ backgroundColor: theme.palette.secondary.main }}>
          {comment?.author?.split(' ')[0][0] +
            comment?.author?.split(' ')[1]?.[0] || 'A'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Stack
            sx={(theme) => ({
              flexDirection: 'column',
              [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
                alignItems: 'center'
              },
              alignItems: 'flex-start'
            })}
            spacing={2}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {comment?.author || t('common.unknownUser')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment?.createdAt || '').toLocaleString()}
            </Typography>
          </Stack>

          {comment?.title && (
            <Typography variant="h6" sx={{ mt: 1, fontSize: '1.05rem' }}>
              {comment.title}
            </Typography>
          )}

          <Typography sx={{ mt: 1 }}>{comment?.text}</Typography>

          {comment?.image && (
            <Box
              component="img"
              src={comment.image}
              alt={comment.title || t('productPage.reviewImageAlt')}
              sx={{
                mt: 1.5,
                width: '100%',
                maxWidth: 320,
                borderRadius: 1,
                objectFit: 'cover'
              }}
            />
          )}

          <Box sx={{ mt: 2 }}>
            <Tooltip
              title={canReply ? '' : replyDisabledReason || ''}
              disableHoverListener={canReply}
            >
              <span>
                <Button
                  onClick={() => setShowReply((s) => !s)}
                  size="small"
                  variant="outlined"
                  disabled={!canReply}
                >
                  {t('productPage.replyToReview')}
                </Button>
              </span>
            </Tooltip>
          </Box>

          {showReply && (
            <Box
              sx={(theme) => ({
                mt: 2,
                ml: 0,
                [theme.breakpoints.up('sm')]: { ml: 4 }
              })}
            >
              <ProductReviewForm
                parentComment={comment?._id}
                onSubmit={async (data) => {
                  await onReply(data, comment?._id);
                  setShowReply(false);
                }}
                submitLabel={t('productPage.replyToReview')}
                disableSubmit={!canReply}
                disableReason={replyDisabledReason}
              />
            </Box>
          )}
        </Box>
      </Box>

      {replies.length > 0 && (
        <Box
          sx={(theme) => ({
            mt: 3,
            ml: 0,
            [theme.breakpoints.up('sm')]: { ml: 4 }
          })}
        >
          {replies?.map((reply) => (
            <Box
              key={reply._id}
              sx={{
                display: 'flex',
                gap: '12px',
                mb: 3,
                pt: 1,
                borderTop: 2,
                borderColor: 'divider'
              }}
            >
              <Avatar
                sx={{ backgroundColor: theme.palette.secondary.main, mt: 4 }}
              >
                {reply?.author?.split(' ')[0][0] +
                  reply?.author?.split(' ')[1]?.[0] || 'A'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline">
                  {t('productPage.reviewReplyLabel')}
                </Typography>
                <Stack
                  sx={(theme) => ({
                    flexDirection: 'column',
                    [theme.breakpoints.up('sm')]: {
                      flexDirection: 'row',
                      alignItems: 'center'
                    },
                    alignItems: 'flex-start'
                  })}
                  spacing={2}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {reply?.author || t('common.unknownUser')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(reply?.createdAt || '').toLocaleString()}
                  </Typography>
                </Stack>
                <Typography>{reply.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
