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
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {comment?.author || 'Anonymous'}
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
                Odgovori
              </Button>
            </Box>
          )}

          {showReply && comment?.parentComment === null && (
            <Box sx={{ mt: 2, ml: { xs: 0, sm: 4 } }}>
              <CommentForm
                parentComment={comment?._id}
                onSubmit={async (text) => {
                  await onReply(text, comment?._id);
                  setShowReply(false);
                }}
                submitLabel="Odgovori"
              />
            </Box>
          )}
        </Box>
      </Box>
      {replies.length > 0 && (
        <Box sx={{ mt: 3, ml: { xs: 0, sm: 4 } }}>
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
                <Typography variant="overline">Odgovor:</Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {r?.author || 'Anonymous'}
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
