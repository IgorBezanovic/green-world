'use client';

import { Box, Button, Typography } from '@mui/material';
import { CheckCheck, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';

import UserContext from '../../context/UserContext';

export type VoteType = 'like' | 'dislike';

export const VoteButtons = ({
  likes,
  dislikes,
  onVote,
  disabled = false
}: {
  likes?: string[];
  dislikes?: string[];
  onVote: (vote: VoteType) => void | Promise<void>;
  disabled?: boolean;
}) => {
  const [pending, setPending] = useState<VoteType | null>(null);
  const { user } = useContext(UserContext);
  const userId = user?._id;

  const hasLiked = !!userId && likes?.includes(userId);
  const hasDisliked = !!userId && dislikes?.includes(userId);
  const score = (likes?.length || 0) - (dislikes?.length || 0);

  const handle = useCallback(
    async (vote: VoteType) => {
      setPending(vote);
      try {
        await onVote(vote);
      } finally {
        setPending(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onVote, pending, disabled]
  );

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        p: 0.75,
        borderRadius: 999,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 10px 30px rgb(15 23 42 / 0.06)',
        flexWrap: 'wrap'
      }}
    >
      <Button
        aria-label="like"
        onClick={() => handle('like')}
        disabled={disabled || hasLiked || pending !== null}
        variant={hasLiked ? 'contained' : 'text'}
        color={hasLiked ? 'success' : 'inherit'}
        sx={{
          minWidth: 0,
          px: 1.5,
          py: 1,
          borderRadius: 999,
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
          color: hasLiked ? 'common.white' : 'text.primary',
          bgcolor: hasLiked ? undefined : 'success.light',
          '& svg': {
            color: 'inherit'
          },
          '&:hover': {
            bgcolor: hasLiked ? undefined : 'success.main',
            color: hasLiked ? 'common.white' : 'common.white',
            '& svg': {
              color: 'common.white'
            }
          },
          '&.Mui-disabled': {
            opacity: hasLiked ? 0.92 : 0.55,
            color: hasLiked ? 'common.white' : 'text.secondary'
          }
        }}
      >
        <ThumbsUp size={16} strokeWidth={2} />
        <Typography component="span" variant="button" sx={{ color: 'inherit' }}>
          {likes?.length || 0}
        </Typography>
        {hasLiked && <CheckCheck />}
      </Button>
      <Box
        component="div"
        sx={{
          minWidth: 44,
          px: 0.5,
          textAlign: 'center',
          fontWeight: 800,
          color: score >= 0 ? 'success.dark' : 'error.main'
        }}
      >
        {score >= 0 ? `+${score}` : `${score}`}
      </Box>
      <Button
        aria-label="dislike"
        onClick={() => handle('dislike')}
        disabled={disabled || hasDisliked || pending !== null}
        variant={hasDisliked ? 'contained' : 'text'}
        color={hasDisliked ? 'error' : 'inherit'}
        sx={{
          minWidth: 0,
          px: 1.5,
          py: 1,
          borderRadius: 999,
          textTransform: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          fontWeight: 700,
          color: hasDisliked ? 'common.white' : 'text.primary',
          bgcolor: hasDisliked ? undefined : 'error.light',
          '& svg': {
            color: 'inherit'
          },
          '&:hover': {
            bgcolor: hasDisliked ? undefined : 'error.main',
            color: hasDisliked ? 'common.white' : 'common.white',
            '& svg': {
              color: 'common.white'
            }
          },
          '&.Mui-disabled': {
            opacity: hasDisliked ? 0.92 : 0.55,
            color: hasDisliked ? 'common.white' : 'text.secondary'
          }
        }}
      >
        <ThumbsDown size={16} strokeWidth={2} />
        <Typography component="span" variant="button" sx={{ color: 'inherit' }}>
          {dislikes?.length || 0}
        </Typography>
        {hasDisliked && <CheckCheck />}
      </Button>
    </Box>
  );
};
