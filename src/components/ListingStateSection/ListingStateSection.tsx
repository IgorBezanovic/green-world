import { ListingSkeletonGrid } from '@green-world/components/ListingSkeletonGrid';
import { Box, Button, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type ListingStateStatus = 'loading' | 'error' | 'empty' | 'ready';

type ListingStateSectionProps = {
  status: ListingStateStatus;
  readyContent: ReactNode;
  errorText?: string;
  emptyTitle: string;
  emptyDescription?: ReactNode;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
};

export const ListingStateSection = ({
  status,
  readyContent,
  errorText,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction
}: ListingStateSectionProps) => {
  if (status === 'loading') {
    return <ListingSkeletonGrid />;
  }

  if (status === 'error') {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography color="error">{errorText}</Typography>
      </Box>
    );
  }

  if (status === 'empty') {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {emptyTitle}
        </Typography>
        {emptyDescription}
        {emptyActionLabel && onEmptyAction ? (
          <Button
            variant="contained"
            color="primary"
            onClick={onEmptyAction}
            sx={{ mt: 2 }}
          >
            {emptyActionLabel}
          </Button>
        ) : null}
      </Box>
    );
  }

  return <>{readyContent}</>;
};
