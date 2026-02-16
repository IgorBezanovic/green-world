import { CommentItem } from '@green-world/components';
import { Comment } from '@green-world/utils/types';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';

export const CommentList = ({
  comments,
  onReply
}: {
  comments: Comment[];
  onReply: (
    text: string,
    parentComment?: string | null
  ) => Promise<void> | void;
}) => {
  const grouped = useMemo(() => {
    const parents = comments.filter((c) => !c.parentComment);
    const map = new Map<string, Comment[]>();
    parents.forEach((p) => {
      map.set(
        p._id || '',
        comments.filter((c) => c.parentComment === p._id)
      );
    });
    return { parents, map };
  }, [comments]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
        Komentari ({comments.length})
      </Typography>

      {grouped.parents.length === 0 ? (
        <Typography sx={{ color: 'text.secondary' }}>
          Nema još komentara.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {grouped.parents?.map((p) => (
            <CommentItem
              key={p._id}
              comment={p}
              replies={grouped.map.get(p._id || '') || []}
              onReply={onReply}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
