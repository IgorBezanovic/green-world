import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import { Box, Button, TextField, Tooltip } from '@mui/material';
import React, { useCallback, useState } from 'react';

export const CommentForm = ({
  parentComment,
  onSubmit,
  submitLabel = 'Pošaljite komentar'
}: {
  parentComment?: string | null;
  onSubmit: (text: string) => Promise<void> | void;
  submitLabel?: string;
}) => {
  const token = getItem('token');
  const decodedToken = safeDecodeToken<DecodedToken>(token);
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
          parentComment ? 'Napišite odgovor...' : 'Napišite komentar...'
        }
        sx={{ '& .MuiInputBase-root': { p: 1 } }}
      />
      <Tooltip
        title={!decodedToken?._id ? 'Morate biti ulogovani' : ''}
        disableHoverListener={Boolean(decodedToken?._id)}
      >
        <span
          style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}
        >
          <Button
            type="button"
            onClick={() => handle()}
            disabled={loading || Boolean(!decodedToken?._id)}
            variant="contained"
            color="primary"
            sx={{ px: 3, py: 1, borderRadius: 1 }}
          >
            {!decodedToken?._id ? 'Morate biti ulogovani' : submitLabel}
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};
