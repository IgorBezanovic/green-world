import { CommentForm } from '@green-world/components';
import { Comment } from '@green-world/utils/types';
import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CommentItem = ({
  comment,
  replies = [],
  onReply
}: {
  comment: Comment;
  replies?: Comment[];
  onReply: (
    text: string,
    parentComment?: string | null
  ) => Promise<void> | void;
}) => {
  const { t } = useTranslation();
  const [showReply, setShowReply] = useState(false);
  const theme = useTheme();

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

          <Typography sx={{ mt: 1 }}>{comment?.text}</Typography>

          {comment?.parentComment === null && (
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={() => setShowReply((s) => !s)}
                size="small"
                variant="outlined"
              >
                {t('commentList.reply')}
              </Button>
            </Box>
          )}

          {showReply && comment?.parentComment === null && (
            <Box
              sx={(theme) => ({
                mt: 2,
                ml: 0,
                [theme.breakpoints.up('sm')]: { ml: 4 }
              })}
            >
              <CommentForm
                parentComment={comment?._id}
                onSubmit={async (text) => {
                  await onReply(text, comment?._id);
                  setShowReply(false);
                }}
                submitLabel={t('commentList.reply')}
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
          {replies?.map((r) => (
            <Box
              key={r._id}
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
                {r?.author?.split(' ')[0][0] + r?.author?.split(' ')[1]?.[0] ||
                  'A'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="overline">
                  {t('commentList.replyTo')}
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
                    {r?.author || t('common.unknownUser')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(r?.createdAt || '').toLocaleString()}
                  </Typography>
                </Stack>
                <Typography>{r.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
