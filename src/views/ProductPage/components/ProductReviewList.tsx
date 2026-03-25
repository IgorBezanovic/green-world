import { Comment } from '@green-world/utils/types';
import { ProductReviewItem } from '@green-world/views/ProductPage/components/ProductReviewItem';
import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type ProductReviewListProps = {
  comments: Comment[];
  canReply: boolean;
  replyDisabledReason?: string;
  onReply: (
    data: { title?: string; text: string; image?: string },
    parentComment?: string | null
  ) => Promise<void> | void;
};

export const ProductReviewList = ({
  comments,
  canReply,
  replyDisabledReason,
  onReply
}: ProductReviewListProps) => {
  const { t } = useTranslation();

  const grouped = useMemo(() => {
    const parents = comments.filter((comment) => !comment.parentComment);
    const map = new Map<string, Comment[]>();

    parents.forEach((parentComment) => {
      map.set(
        parentComment._id || '',
        comments.filter(
          (comment) => comment.parentComment === parentComment._id
        )
      );
    });

    return { parents, map };
  }, [comments]);

  return (
    <Box sx={{ pt: 2 }}>
      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1.5 }}>
        {t('productPage.reviewsCount', { count: comments.length })}
      </Typography>

      {grouped.parents.length === 0 ? (
        <Typography
          sx={(theme) => ({
            color: 'text.secondary',
            textAlign: 'center',
            mt: 2,
            mb: 1,
            [theme.breakpoints.up('sm')]: {
              textAlign: 'left'
            }
          })}
        >
          {t('productPage.reviewsEmpty')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {grouped.parents.map((parentComment) => (
            <ProductReviewItem
              key={parentComment._id}
              comment={parentComment}
              replies={grouped.map.get(parentComment._id || '') || []}
              canReply={canReply}
              replyDisabledReason={replyDisabledReason}
              onReply={onReply}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
