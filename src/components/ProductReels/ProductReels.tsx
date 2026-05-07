'use client';

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material';
import { Download, Play, X } from 'lucide-react';
import { useState } from 'react';

interface Reel {
  _id?: string;
  reelId?: string;
  url?: string;
  status?: 'generating' | 'completed' | 'failed';
  prompt?: string;
  generatedAt?: string;
}

interface ProductReelsProps {
  reels?: Reel[];
  productTitle: string;
}

export const ProductReels = ({ reels, productTitle }: ProductReelsProps) => {
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);

  if (!reels || reels.length === 0) {
    return null;
  }

  const completedReels = reels.filter((r) => r.status === 'completed' && r.url);

  if (completedReels.length === 0) {
    return null;
  }

  const handleDownloadReel = (reel: Reel) => {
    if (!reel.url) return;

    const link = document.createElement('a');
    link.href = reel.url;
    link.download = `${productTitle.replace(/\s+/g, '_')}_reel.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          📹 Reels Videa
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 2
          }}
        >
          {completedReels.map((reel, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                aspectRatio: '9/16',
                bgcolor: '#000',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(0.98)'
                }
              }}
              onClick={() => setSelectedReel(reel)}
            >
              <Box
                component="video"
                src={reel.url}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 1 }
                }}
              >
                <IconButton sx={{ color: '#fff' }}>
                  <Play size={48} fill="#fff" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Reel viewer dialog */}
      <Dialog
        open={!!selectedReel}
        onClose={() => setSelectedReel(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: '#000' }
        }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ color: '#fff' }}
          >
            {productTitle}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setSelectedReel(null)}
            sx={{ color: '#fff' }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedReel?.url ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                component="video"
                src={selectedReel.url}
                controls
                autoPlay
                width="100%"
                height="auto"
                sx={{ borderRadius: 1, bgcolor: '#000' }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Download size={18} />}
                  onClick={() => handleDownloadReel(selectedReel)}
                  fullWidth
                >
                  Preuzmi
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open(selectedReel.url, '_blank')}
                  fullWidth
                  sx={{
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Otvori
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary">Video nije dostupan</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
