import UserContext from '@green-world/context/UserContext';
import { useImage } from '@green-world/hooks/useImage';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProductReviewFormProps = {
  parentComment?: string | null;
  submitLabel?: string;
  disableSubmit?: boolean;
  disableReason?: string;
  onSubmit: (data: {
    title?: string;
    text: string;
    image?: string;
  }) => Promise<void> | void;
};

export const ProductReviewForm = ({
  parentComment,
  submitLabel,
  disableSubmit = false,
  disableReason,
  onSubmit
}: ProductReviewFormProps) => {
  const { t } = useTranslation();
  const { isUserLoggedIn } = useContext(UserContext);
  const { mutateAsync: uploadImage, isPending: isImageUploading } = useImage();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const isReply = Boolean(parentComment);
  const isDisabled =
    !isUserLoggedIn || disableSubmit || loading || isImageUploading;

  const tooltipTitle = useMemo(() => {
    if (!isUserLoggedIn) return t('productPage.mustLoginToReview');
    if (disableSubmit && disableReason) return disableReason;
    return '';
  }, [disableReason, disableSubmit, isUserLoggedIn, t]);

  const onImageSelect = useCallback(
    async (file?: File) => {
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const uploadedImageUrl = await uploadImage(formData);
      setImage(uploadedImageUrl || '');
    },
    [uploadImage]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!text.trim()) return;
      if (!isReply && !title.trim()) return;

      setLoading(true);
      try {
        await onSubmit({
          title: isReply ? undefined : title.trim(),
          text: text.trim(),
          image: isReply ? undefined : image || undefined
        });

        setText('');
        if (!isReply) {
          setTitle('');
          setImage('');
        }
      } finally {
        setLoading(false);
      }
    },
    [image, isReply, onSubmit, text, title]
  );

  const outlinedInputSx = {
    mb: 2,
    bgcolor: 'background.default',
    '& .MuiOutlinedInput-root.MuiInputBase-multiline': {
      p: 0
    },
    '& .MuiOutlinedInput-input': {
      p: '12px'
    },
    '& .MuiOutlinedInput-inputMultiline': {
      p: '12px'
    }
  };

  const labelSx = {
    mb: 0.5,
    color: 'secondary.main',
    fontSize: '1.125rem'
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
    >
      {!isReply && (
        <>
          <Typography htmlFor="review-title" component="label" sx={labelSx}>
            {t('productPage.reviewTitle')}
          </Typography>
          <TextField
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder={t('productPage.reviewTitlePlaceholder')}
            required
            sx={outlinedInputSx}
          />
        </>
      )}

      <Typography htmlFor="review-description" component="label" sx={labelSx}>
        {isReply
          ? t('productPage.reviewReplyDescription')
          : t('productPage.reviewDescription')}
      </Typography>
      <TextField
        id="review-description"
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        required
        placeholder={
          isReply
            ? t('productPage.reviewReplyPlaceholder')
            : t('productPage.reviewDescriptionPlaceholder')
        }
        sx={outlinedInputSx}
      />

      {!isReply && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            component="label"
            variant="outlined"
            disabled={isDisabled}
            sx={{ width: 'fit-content' }}
          >
            {isImageUploading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                {t('productPage.uploadingImage')}
              </Box>
            ) : (
              t('productPage.reviewAddImage')
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => onImageSelect(e.target.files?.[0])}
            />
          </Button>

          {image && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="img"
                src={formatImageUrl(image, 65)}
                alt={t('productPage.reviewImageAlt')}
                sx={{
                  width: '160px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: 1
                }}
              />
              <Button
                color="error"
                variant="text"
                sx={{ width: 'fit-content' }}
                onClick={() => setImage('')}
              >
                {t('productPage.reviewRemoveImage')}
              </Button>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            {t('productPage.reviewImageOptional')}
          </Typography>
        </Box>
      )}

      <Tooltip title={tooltipTitle} disableHoverListener={!tooltipTitle}>
        <span
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isDisabled}
            variant="contained"
            color="primary"
            sx={{ px: 3, py: 1, borderRadius: 1 }}
          >
            {!isUserLoggedIn
              ? t('productPage.mustLoginToReview')
              : submitLabel || t('productPage.submitReview')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};
