'use client';

import { useSendMessage } from '@green-world/hooks/useSendMessage';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SendMessageDialogProps {
  open: boolean;
  initialMessage?: string;
  title?: string;
  onClose: () => void;
  userId: string;
}

export const SendMessageDialog = ({
  open,
  initialMessage = '',
  title,
  onClose,
  userId
}: SendMessageDialogProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState(initialMessage);
  const sendMessageMutation = useSendMessage();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    sendMessageMutation.mutate({ receiverId: userId, content: trimmed });
    setMessage('');
    onClose();
  };

  const handleCancel = () => {
    setMessage(initialMessage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>{title || t('sendMessageDialog.title')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: 'black' }}>
            {t('sendMessageDialog.description')}
          </DialogContentText>
          <TextField
            id="message-input"
            autoFocus
            fullWidth
            multiline
            minRows={3}
            placeholder={t('sendMessageDialog.placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            slotProps={{ htmlInput: { 'aria-label': 'message' } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancel}>
            {t('sendMessageDialog.cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={message.trim().length === 0}
          >
            {t('sendMessageDialog.send')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
