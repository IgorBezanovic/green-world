'use client';

import { formatImageUrl } from '@green-world/utils/helpers';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { Box, Dialog, IconButton } from '@mui/material';

interface FullImageDialogProps {
  openImageModal: boolean;
  setOpenImageModal: (open: boolean) => void;
  images: string[] | undefined;
  title?: string;
  idexOfImage: number;
  handleNext: () => void;
  handlePrev: () => void;
}

export const FullImageDialog = ({
  openImageModal,
  setOpenImageModal,
  images,
  title,
  idexOfImage,
  handleNext,
  handlePrev
}: FullImageDialogProps) => {
  const doesImagesExist = images?.length && images?.length > 1;

  return (
    <Dialog
      open={openImageModal}
      onClose={() => setOpenImageModal(false)}
      fullWidth
      maxWidth="xl"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            position: 'relative'
          }
        }
      }}
    >
      <IconButton
        onClick={() => setOpenImageModal(false)}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#fff',
          zIndex: 10
        }}
      >
        <Close />
      </IconButton>

      {doesImagesExist && (
        <IconButton
          onClick={handlePrev}
          sx={{
            position: 'absolute',
            left: 18,
            color: '#fff',
            zIndex: 10,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ChevronLeft sx={{ fontSize: 40 }} />
        </IconButton>
      )}

      <Box
        component="img"
        src={formatImageUrl(images?.[idexOfImage] || '')}
        alt={title}
        sx={{
          height: '90vh',
          width: '90vw',
          borderRadius: '6px',
          objectFit: 'contain',
          boxShadow: '0 2px 16px rgba(0,0,0,0.5)'
        }}
      />

      {doesImagesExist && (
        <IconButton
          onClick={handleNext}
          sx={{
            position: 'absolute',
            right: 18,
            color: '#fff',
            zIndex: 10,
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <ChevronRight sx={{ fontSize: 40 }} />
        </IconButton>
      )}
    </Dialog>
  );
};
