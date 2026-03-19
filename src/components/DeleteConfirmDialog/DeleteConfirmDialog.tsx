import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { ReactNode } from 'react';

interface DeleteConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  cancelText: ReactNode;
  confirmText: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmDialog = ({
  open,
  title,
  description,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  isLoading = false
}: DeleteConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit" disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isLoading}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
