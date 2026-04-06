'use client';

import { formatImageUrl } from '@green-world/utils/helpers';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  mobileScrollOffset?: number;
  mainImageQuality?: number;
  thumbnailQuality?: number;
  mb?: number | string;
}

export const ImageGallery = ({
  images,
  title,
  mobileScrollOffset = 110,
  mainImageQuality,
  thumbnailQuality = 55,
  mb = 0
}: ImageGalleryProps) => {
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);

  const safeSelectedIndex = useMemo(() => {
    if (!images?.length) return 0;
    return Math.min(selectedIndex, images.length - 1);
  }, [images, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
    setOpenImageModal(false);
  }, [images]);

  const handlePrev = () => {
    if (!images?.length) return;
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!images?.length) return;
    setSelectedIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);

    if (window.innerWidth < 900 && mainImageRef.current) {
      const y =
        mainImageRef.current.getBoundingClientRect().top +
        window.scrollY -
        mobileScrollOffset;

      window.scrollTo({ top: Math.max(y, 0), behavior: 'smooth' });
    }
  };

  if (!images?.length) return null;

  return (
    <Box
      ref={mainImageRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '16px',
        mb
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden'
        }}
      >
        {images.length > 1 && (
          <Button
            onClick={handlePrev}
            sx={(theme) => ({
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 50,
              backgroundColor: 'rgba(81, 81, 81, 0.60)',
              borderRadius: '6px',
              opacity: 1,
              [theme.breakpoints.up('md')]: { opacity: 0 },
              '&:hover': {
                [theme.breakpoints.up('md')]: { opacity: 1 },
                backgroundColor: 'rgba(81, 81, 81, 0.60)'
              },
              minWidth: 0,
              padding: 0,
              zIndex: 1
            })}
          >
            <ArrowLeft color="#fff" />
          </Button>
        )}

        <Box
          component="img"
          src={formatImageUrl(
            images[safeSelectedIndex] || '',
            mainImageQuality
          )}
          alt={title}
          onClick={() => setOpenImageModal(true)}
          sx={{
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer'
          }}
        />

        {images.length > 1 && (
          <Button
            onClick={handleNext}
            sx={(theme) => ({
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 50,
              backgroundColor: 'rgba(81, 81, 81, 0.60)',
              borderRadius: '6px',
              opacity: 1,
              [theme.breakpoints.up('md')]: { opacity: 0 },
              '&:hover': {
                [theme.breakpoints.up('md')]: { opacity: 1 },
                backgroundColor: 'rgba(81, 81, 81, 0.60)'
              },
              minWidth: 0,
              padding: 0,
              zIndex: 1
            })}
          >
            <ArrowRight color="#fff" />
          </Button>
        )}
      </Box>

      {images.length > 1 && (
        <Box
          component="footer"
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            [theme.breakpoints.up('xs')]: {
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
            },
            width: '100%',
            gap: '16px'
          })}
        >
          {images.map((image, index) => (
            <Box
              component="img"
              src={formatImageUrl(image, thumbnailQuality)}
              alt={image}
              key={`${image}-${index}`}
              onClick={() => handleThumbnailClick(index)}
              sx={(theme) => ({
                borderRadius: '6px',
                boxShadow: 'var(--mui-shadow, 0px 1px 3px rgba(0,0,0,0.1))',
                aspectRatio: '1 / 1',
                width: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(safeSelectedIndex === index && {
                  boxShadow: theme.shadows[10],
                  border: '2px solid',
                  borderColor: 'forestGreen'
                })
              })}
            />
          ))}
        </Box>
      )}

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

        {images.length > 1 && (
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
          src={formatImageUrl(images[safeSelectedIndex] || '')}
          alt={title}
          sx={{
            height: '90vh',
            width: '90vw',
            borderRadius: '6px',
            objectFit: 'contain',
            boxShadow: '0 2px 16px rgba(0,0,0,0.5)'
          }}
        />

        {images.length > 1 && (
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
    </Box>
  );
};
