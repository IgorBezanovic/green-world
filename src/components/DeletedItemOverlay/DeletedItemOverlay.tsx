'use client';

import { Box, Button, Typography } from '@mui/material';
import { Ban, Store } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export type DeletedItemType = 'proizvod' | 'dogadjaj' | 'blog post' | 'uslugu';

interface DeletedItemOverlayProps {
  itemType: DeletedItemType;
  /** _id of the user who created the item */
  creatorId?: string;
  /**
   * Pass `true` once we know the creator no longer exists in the system
   * (i.e. the useUser / creator fetch returned an error or null data).
   * While the query is still loading this should be `false` / `undefined`.
   */
  creatorNotFound?: boolean;
}

export const DeletedItemOverlay = ({
  itemType,
  creatorId,
  creatorNotFound
}: DeletedItemOverlayProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect when creator account has been deleted
  useEffect(() => {
    if (creatorNotFound) {
      toast.info(t('deletedItem.creatorGone'), {
        toastId: 'deleted-creator',
        autoClose: 4000
      });
      navigate('/shops');
    }
  }, [creatorNotFound, navigate, t]);

  // While redirect is happening nothing is rendered
  if (creatorNotFound) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        backdropFilter: 'blur(3px)',
        backgroundColor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        sx={(theme) => ({
          backgroundColor: 'background.paper',
          borderRadius: 3,
          px: 4,
          py: 5,
          maxWidth: 480,
          width: '90%',
          textAlign: 'center',
          boxShadow: theme.shadows[8],
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        })}
      >
        <Typography
          variant="h5"
          color="text.primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Ban strokeWidth={1.4} color="#b91c1c" />
          {t('deletedItem.title', { itemType })}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {t('deletedItem.description', { itemType })}
        </Typography>

        {creatorId && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Store color="white" />}
            onClick={() => navigate(`/shop/${creatorId}`)}
            sx={{ mt: 1 }}
          >
            {t('deletedItem.visitShop')}
          </Button>
        )}
      </Box>
    </Box>
  );
};
