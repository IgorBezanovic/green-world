import { useSendMessage } from '@green-world/hooks/useSendMessage';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormLabel,
  DialogContentText
} from '@mui/material';
import React, { useState } from 'react';

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
  title = 'Slanje poruke',
  onClose,
  userId
}: SendMessageDialogProps) => {
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
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, color: 'black' }}>
            Molimo vas da se pridržavate lepog ponašanja i pokažete poštovanje
            prema drugim korisnicima. Vaša poruka treba biti prijateljska i
            konstruktivna.
          </DialogContentText>
          <FormLabel
            htmlFor="message-input"
            sx={{ mb: 1, display: 'block', fontWeight: 500, color: 'black' }}
          >
            Poruka
          </FormLabel>
          <TextField
            id="message-input"
            autoFocus
            fullWidth
            multiline
            minRows={3}
            placeholder="Unesite vašu poruku..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            slotProps={{ htmlInput: { 'aria-label': 'message' } }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={message.trim().length === 0}
          >
            Pošalji poruku
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
