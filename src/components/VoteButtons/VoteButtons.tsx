import { Box, Button } from '@mui/material';
import { CheckCheck } from 'lucide-react';
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        aria-label="like"
        onClick={() => handle('like')}
        disabled={disabled || hasLiked}
        variant="outlined"
        sx={{
          px: 2,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          👍
        </Box>
        {hasLiked && <CheckCheck />}
      </Button>
      <Box
        component="span"
        sx={{
          mx: 1,
          minWidth: 30,
          textAlign: 'center',
          fontWeight: 'bold',
          color:
            (likes?.length || 0) - (dislikes?.length || 0) >= 0
              ? 'success.main'
              : 'error.main'
        }}
      >
        {(likes?.length || 0) - (dislikes?.length || 0) >= 0
          ? `+${(likes?.length || 0) - (dislikes?.length || 0)}`
          : `${(likes?.length || 0) - (dislikes?.length || 0)}`}
      </Box>
      <Button
        aria-label="dislike"
        onClick={() => handle('dislike')}
        disabled={disabled || hasDisliked}
        variant="outlined"
        sx={{
          px: 2,
          textTransform: 'none',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          👎
        </Box>
        {hasDisliked && <CheckCheck />}
      </Button>
    </Box>
  );
};
