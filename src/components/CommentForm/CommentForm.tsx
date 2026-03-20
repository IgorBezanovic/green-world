import UserContext from '@green-world/context/UserContext';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const CommentForm = ({
  parentComment,
  onSubmit,
  submitLabel
}: {
  parentComment?: string | null;
  onSubmit: (text: string) => Promise<void> | void;
  submitLabel?: string;
}) => {
  const { t } = useTranslation();
  const { isUserLoggedIn } = useContext(UserContext);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!text.trim()) return;
      setLoading(true);
      try {
        await onSubmit(text.trim());
        setText('');
      } finally {
        setLoading(false);
      }
    },
    [text, onSubmit]
  );

  return (
    <Box
      component="form"
      onSubmit={handle}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        placeholder={
          parentComment
            ? t('commentForm.replyPlaceholder')
            : t('commentForm.commentPlaceholder')
        }
        sx={{ '& .MuiInputBase-root': { p: 1 } }}
      />
      <Tooltip
        title={!isUserLoggedIn ? t('commentForm.mustLogin') : ''}
        disableHoverListener={isUserLoggedIn}
      >
        <span
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            onClick={() => handle()}
            disabled={loading || !isUserLoggedIn}
            variant="contained"
            color="primary"
            sx={{ px: 3, py: 1, borderRadius: 1 }}
          >
            {!isUserLoggedIn
              ? t('commentForm.mustLogin')
              : submitLabel || t('commentForm.submit')}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};
